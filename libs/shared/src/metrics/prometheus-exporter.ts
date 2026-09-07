import { MetricDefinition } from './metrics.interface';

/**
 * Formats a key-value labels object into standard Prometheus label string: `{key="val",key2="val2"}`.
 */
export function formatPrometheusLabels(labels: Record<string, string | number>): string {
  const entries = Object.entries(labels);
  if (entries.length === 0) return '';
  const formatted = entries
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`)
    .join(',');
  return `{${formatted}}`;
}

/**
 * Serializes an array of MetricDefinitions into standard Prometheus 0.0.4 text format.
 */
export function serializeToPrometheusText(metrics: MetricDefinition[]): string {
  const lines: string[] = [];

  for (const metric of metrics) {
    lines.push(`# HELP ${metric.name} ${metric.help}`);
    lines.push(`# TYPE ${metric.name} ${metric.type}`);

    if (metric.type === 'histogram' && metric.histogramSamples) {
      for (const sample of metric.histogramSamples) {
        const baseLabels = { ...sample.labels };

        // Output bucket counts
        for (const [le, count] of Object.entries(sample.buckets)) {
          const bucketLabels = formatPrometheusLabels({ ...baseLabels, le });
          lines.push(`${metric.name}_bucket${bucketLabels} ${count}`);
        }

        const standardLabels = formatPrometheusLabels(baseLabels);
        lines.push(`${metric.name}_sum${standardLabels} ${sample.sum}`);
        lines.push(`${metric.name}_count${standardLabels} ${sample.count}`);
      }
    } else {
      for (const sample of metric.samples) {
        const labelStr = formatPrometheusLabels(sample.labels);
        lines.push(`${metric.name}${labelStr} ${sample.value}`);
      }
    }

    lines.push(''); // Empty line between metric groups
  }

  return lines.join('\n');
}
