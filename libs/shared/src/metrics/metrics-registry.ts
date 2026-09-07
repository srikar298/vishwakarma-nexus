import {
  ICounter,
  IGauge,
  IHistogram,
  IMetricsRegistry,
  MetricDefinition,
  MetricLabels,
} from './metrics.interface';
import { serializeToPrometheusText } from './prometheus-exporter';

function labelsToKey(labels: MetricLabels = {}): string {
  const sortedKeys = Object.keys(labels).sort();
  return sortedKeys.map((k) => `${k}:${labels[k]}`).join(',');
}

class CounterImpl implements ICounter {
  private values = new Map<string, { labels: MetricLabels; value: number }>();

  constructor(public readonly name: string, public readonly help: string) {}

  public inc(labels: MetricLabels = {}, value = 1): void {
    if (value < 0) {
      throw new Error(`Counter ${this.name} cannot be incremented by negative value`);
    }
    const key = labelsToKey(labels);
    const current = this.values.get(key) || { labels, value: 0 };
    current.value += value;
    this.values.set(key, current);
  }

  public reset(): void {
    this.values.clear();
  }

  public getSamples() {
    return Array.from(this.values.values());
  }
}

class GaugeImpl implements IGauge {
  private values = new Map<string, { labels: MetricLabels; value: number }>();

  constructor(public readonly name: string, public readonly help: string) {}

  public set(value: number, labels: MetricLabels = {}): void {
    const key = labelsToKey(labels);
    this.values.set(key, { labels, value });
  }

  public inc(labels: MetricLabels = {}, value = 1): void {
    const key = labelsToKey(labels);
    const current = this.values.get(key) || { labels, value: 0 };
    current.value += value;
    this.values.set(key, current);
  }

  public dec(labels: MetricLabels = {}, value = 1): void {
    const key = labelsToKey(labels);
    const current = this.values.get(key) || { labels, value: 0 };
    current.value -= value;
    this.values.set(key, current);
  }

  public reset(): void {
    this.values.clear();
  }

  public getSamples() {
    return Array.from(this.values.values());
  }
}

class HistogramImpl implements IHistogram {
  private buckets: number[];
  private samples = new Map<string, {
    labels: MetricLabels;
    buckets: Record<number | string, number>;
    sum: number;
    count: number;
  }>();

  constructor(
    public readonly name: string,
    public readonly help: string,
    buckets: number[] = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
  ) {
    this.buckets = [...buckets].sort((a, b) => a - b);
  }

  public observe(value: number, labels: MetricLabels = {}): void {
    const key = labelsToKey(labels);
    let sample = this.samples.get(key);

    if (!sample) {
      const bucketCounts: Record<number | string, number> = {};
      for (const b of this.buckets) {
        bucketCounts[b] = 0;
      }
      bucketCounts['+Inf'] = 0;

      sample = {
        labels,
        buckets: bucketCounts,
        sum: 0,
        count: 0,
      };
      this.samples.set(key, sample);
    }

    sample.count++;
    sample.sum += value;

    for (const b of this.buckets) {
      if (value <= b) {
        sample.buckets[b]++;
      }
    }
    sample.buckets['+Inf']++;
  }

  public reset(): void {
    this.samples.clear();
  }

  public getHistogramSamples() {
    return Array.from(this.samples.values());
  }
}

/**
 * Low-Level Design (LLD): Enterprise Prometheus Metrics Registry
 * Manages metric instruments (Counters, Gauges, Histograms) and exports to Prometheus.
 */
export class MetricsRegistry implements IMetricsRegistry {
  private counters = new Map<string, CounterImpl>();
  private gauges = new Map<string, GaugeImpl>();
  private histograms = new Map<string, HistogramImpl>();

  public createCounter(name: string, help: string): ICounter {
    let counter = this.counters.get(name);
    if (!counter) {
      counter = new CounterImpl(name, help);
      this.counters.set(name, counter);
    }
    return counter;
  }

  public createGauge(name: string, help: string): IGauge {
    let gauge = this.gauges.get(name);
    if (!gauge) {
      gauge = new GaugeImpl(name, help);
      this.gauges.set(name, gauge);
    }
    return gauge;
  }

  public createHistogram(name: string, help: string, buckets?: number[]): IHistogram {
    let histogram = this.histograms.get(name);
    if (!histogram) {
      histogram = new HistogramImpl(name, help, buckets);
      this.histograms.set(name, histogram);
    }
    return histogram;
  }

  public getMetric(name: string): MetricDefinition | undefined {
    return this.getAllMetrics().find((m) => m.name === name);
  }

  public getAllMetrics(): MetricDefinition[] {
    const list: MetricDefinition[] = [];

    for (const counter of this.counters.values()) {
      list.push({
        name: counter.name,
        help: counter.help,
        type: 'counter',
        samples: counter.getSamples(),
      });
    }

    for (const gauge of this.gauges.values()) {
      list.push({
        name: gauge.name,
        help: gauge.help,
        type: 'gauge',
        samples: gauge.getSamples(),
      });
    }

    for (const hist of this.histograms.values()) {
      list.push({
        name: hist.name,
        help: hist.help,
        type: 'histogram',
        samples: [],
        histogramSamples: hist.getHistogramSamples(),
      });
    }

    return list;
  }

  public exportPrometheus(): string {
    return serializeToPrometheusText(this.getAllMetrics());
  }

  public clear(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}

export const defaultMetricsRegistry: IMetricsRegistry = new MetricsRegistry();

/**
 * Standard Platform Metric Names Catalog
 * Referenced across Components 1, 2, 3, 4, 5, 6, 8, 9, 10
 */
export const PLATFORM_METRICS = {
  CIRCUIT_BREAKER_REJECTED: 'circuit_breaker_rejected_total',
  BULKHEAD_REJECTED: 'bulkhead_rejected_total',
  LOCK_TIMEOUT: 'lock_acquisition_timeout_total',
  SINGLE_FLIGHT_DEDUPLICATED: 'single_flight_deduplicated_total',
  CACHE_L1_HIT: 'hybrid_cache_l1_hit_total',
  CACHE_L2_HIT: 'hybrid_cache_l2_hit_total',
  CACHE_STAMPEDE_GUARDED: 'cache_stampede_guarded_total',
  IDEMPOTENCY_MISMATCH: 'idempotency_fingerprint_mismatch_total',
  RATE_LIMIT_EXCEEDED: 'business_rate_limit_exceeded_total',
  DOMAIN_EVENT_PUBLISHED: 'domain_event_published_total',
  OUTBOX_PENDING_BATCH: 'outbox_pending_batch_size',
  EVENT_DLQ: 'event_dlq_total',
  JOB_DURATION_SECONDS: 'job_execution_duration_seconds',
  NOTIFICATION_DELIVERED: 'notification_delivered_total',
} as const;
