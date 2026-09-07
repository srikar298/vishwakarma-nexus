/**
 * Low-Level Design (LLD): Enterprise Prometheus Metrics Interface
 * Supports standardized instrumentation: Counters, Gauges, and Histograms.
 */

export type MetricType = 'counter' | 'gauge' | 'histogram';

export type MetricLabels = Record<string, string | number>;

export interface MetricSample {
  labels: MetricLabels;
  value: number;
}

export interface HistogramSample {
  labels: MetricLabels;
  buckets: Record<number | string, number>;
  sum: number;
  count: number;
}

export interface MetricDefinition {
  name: string;
  help: string;
  type: MetricType;
  samples: MetricSample[];
  histogramSamples?: HistogramSample[];
}

export interface ICounter {
  readonly name: string;
  readonly help: string;
  inc(labels?: MetricLabels, value?: number): void;
  reset(): void;
}

export interface IGauge {
  readonly name: string;
  readonly help: string;
  set(value: number, labels?: MetricLabels): void;
  inc(labels?: MetricLabels, value?: number): void;
  dec(labels?: MetricLabels, value?: number): void;
  reset(): void;
}

export interface IHistogram {
  readonly name: string;
  readonly help: string;
  observe(value: number, labels?: MetricLabels): void;
  reset(): void;
}

export interface IMetricsRegistry {
  createCounter(name: string, help: string, labelNames?: string[]): ICounter;
  createGauge(name: string, help: string, labelNames?: string[]): IGauge;
  createHistogram(name: string, help: string, buckets?: number[], labelNames?: string[]): IHistogram;
  getMetric(name: string): MetricDefinition | undefined;
  getAllMetrics(): MetricDefinition[];
  exportPrometheus(): string;
  clear(): void;
}
