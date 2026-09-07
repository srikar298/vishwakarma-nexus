import { describe, it, expect, beforeEach } from 'vitest';
import { MetricsRegistry } from './index';

describe('Component 10.4: Metrics Subsystem (Prometheus Metric Instruments)', () => {
  let registry: MetricsRegistry;

  beforeEach(() => {
    registry = new MetricsRegistry();
  });

  it('should track counter increments with multidimensional labels', () => {
    const counter = registry.createCounter(
      'vkc_http_requests_total',
      'Total number of HTTP requests processed'
    );

    counter.inc({ method: 'GET', status: '200' }, 5);
    counter.inc({ method: 'POST', status: '201' }, 2);
    counter.inc({ method: 'GET', status: '200' }, 3);

    const metric = registry.getMetric('vkc_http_requests_total');
    expect(metric).toBeDefined();
    expect(metric?.type).toBe('counter');

    const sample200 = metric?.samples.find((s) => s.labels.method === 'GET' && s.labels.status === '200');
    expect(sample200?.value).toBe(8);

    const sample201 = metric?.samples.find((s) => s.labels.method === 'POST' && s.labels.status === '201');
    expect(sample201?.value).toBe(2);
  });

  it('should track gauge values, increments, and decrements', () => {
    const gauge = registry.createGauge(
      'vkc_active_worker_threads',
      'Number of active background worker threads'
    );

    gauge.set(5, { queue: 'notifications' });
    gauge.inc({ queue: 'notifications' }, 2);
    gauge.dec({ queue: 'notifications' }, 1);

    const metric = registry.getMetric('vkc_active_worker_threads');
    const sample = metric?.samples.find((s) => s.labels.queue === 'notifications');
    expect(sample?.value).toBe(6);
  });

  it('should observe histogram values and calculate bucket distributions', () => {
    const histogram = registry.createHistogram(
      'vkc_http_request_duration_ms',
      'HTTP request latency in milliseconds',
      [10, 50, 100, 500]
    );

    histogram.observe(5, { path: '/api/v1/members' });
    histogram.observe(25, { path: '/api/v1/members' });
    histogram.observe(75, { path: '/api/v1/members' });
    histogram.observe(300, { path: '/api/v1/members' });

    const metric = registry.getMetric('vkc_http_request_duration_ms');
    expect(metric?.type).toBe('histogram');

    const sample = metric?.histogramSamples?.[0];
    expect(sample?.count).toBe(4);
    expect(sample?.sum).toBe(405);
    expect(sample?.buckets[10]).toBe(1);
    expect(sample?.buckets[50]).toBe(2);
    expect(sample?.buckets[100]).toBe(3);
    expect(sample?.buckets[500]).toBe(4);
    expect(sample?.buckets['+Inf']).toBe(4);
  });

  it('should export all metrics in standard Prometheus 0.0.4 text format', () => {
    const counter = registry.createCounter('test_counter_total', 'Test counter help');
    counter.inc({ service: 'auth' }, 42);

    const exported = registry.exportPrometheus();

    expect(exported).toContain('# HELP test_counter_total Test counter help');
    expect(exported).toContain('# TYPE test_counter_total counter');
    expect(exported).toContain('test_counter_total{service="auth"} 42');
  });
});
