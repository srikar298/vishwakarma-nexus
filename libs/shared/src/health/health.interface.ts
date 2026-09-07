export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
  details?: Record<string, any>;
}

export interface IHealthIndicator {
  readonly name: string;
  check(): Promise<HealthCheckResult>;
}

export interface SystemHealthReport {
  status: HealthStatus;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  checks: HealthCheckResult[];
}
