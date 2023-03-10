import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { metrics, ValueType } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { onCLS, onFID, onTTFB, onFCP, onLCP } from 'web-vitals';

const webVitalCallbackMap = {
  'Cumulative Layout Shift (CLS)': onCLS,
  'First Input Delay (FID)': onFID,
  'Largest Contentful Paint (LCP)': onLCP,
  'First Contentful Paint (FCP)': onFCP,
  'Time to First Byte (TTFB)': onTTFB,
};
type WebVitalMetric = keyof typeof webVitalCallbackMap;

/**
 * Setup OpenTelementry metric
 */

const meterProvider = new MeterProvider();
metrics.setGlobalMeterProvider(meterProvider);

meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 10000,
  })
);

const meter = meterProvider.getMeter('web-vitals');

/**
 * Create Guage for all available web vitals
 */
export function setupGuage(metricName: WebVitalMetric) {
  const metricHandler = webVitalCallbackMap[metricName];
  console.log(metricName);
  metricHandler((value) => {
    const guage = meter.createObservableGauge(metricName, {
      description: metricName,
      unit: 'ms',
      valueType: ValueType.INT,
    });
    guage.addCallback((observableResult) => observableResult.observe(value.value));
  });
}

Object.keys(webVitalCallbackMap).forEach((metricName) => {
  setupGuage(metricName as WebVitalMetric);
});
