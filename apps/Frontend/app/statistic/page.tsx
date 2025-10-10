"use client";

import React, { useRef, useEffect, use } from "react";
import { Chart } from "chart.js";

// temp from net
const LineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["January", "February", "March", "April"],
            datasets: [
              {
                label: "Demo Line Graph",
                data: [12, 19, 3, 5],
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
              },
            ],
          },
        });
      }
    }
  }, []);

  return <canvas ref={chartRef} width="400" height="200"></canvas>;
};

export default LineChart;
