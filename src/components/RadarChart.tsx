'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  labels: string[];
  current: number[];
  future: number[];
}

export default function RadarChart({ labels, current, future }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: '현재 역량',
            data: current,
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderColor: 'rgba(59, 130, 246, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(59, 130, 246, 0.9)',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: '미래 목표',
            data: future,
            backgroundColor: 'rgba(251, 113, 133, 0.1)',
            borderColor: 'rgba(244, 63, 94, 0.7)',
            borderWidth: 2,
            borderDash: [5, 4],
            pointBackgroundColor: 'rgba(244, 63, 94, 0.8)',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, family: 'inherit' },
              color: '#57534e',
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.r}점`,
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              font: { size: 10, family: 'inherit' },
              color: '#a8a29e',
              backdropColor: 'transparent',
            },
            pointLabels: {
              font: { size: 12, weight: 500, family: 'inherit' },
              color: '#44403c',
            },
            grid: {
              color: 'rgba(168, 162, 158, 0.3)',
            },
            angleLines: {
              color: 'rgba(168, 162, 158, 0.3)',
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [labels, current, future]);

  return (
    <div className="w-full max-w-md mx-auto">
      <canvas ref={canvasRef} />
    </div>
  );
}
