import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";

type ChartType = "line" | "bar" | "pie" | "scatter";

type Props = {
  type: ChartType;
  rows: any[];
  xKey: string;
  yKey: string;
  height?: number;
};

export default function EChart({ type, rows, xKey, yKey, height = 380 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const option = useMemo(() => {
    if (!rows.length) return {};

    const xData = rows.map((r) => r[xKey]);
    const yData = rows.map((r) => Number(r[yKey] ?? 0));

    // Pie chart
    if (type === "pie") {
      return {
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        series: [
          {
            type: "pie",
            data: rows.map((r) => ({
              name: r[xKey],
              value: Number(r[yKey] ?? 0),
            })),
            radius: ["40%", "70%"],
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } },
          },
        ],
      };
    }

    // Scatter plot
    if (type === "scatter") {
      return {
        tooltip: { trigger: "item" },
        xAxis: { type: "value", scale: true },
        yAxis: { type: "value", scale: true },
        series: [
          {
            type: "scatter",
            data: rows.map((r, i) => [i, Number(r[yKey] ?? 0)]),
            symbolSize: 8,
            itemStyle: { color: "rgba(102, 126, 234, 0.6)" },
          },
        ],
        grid: { left: 44, right: 20, top: 30, bottom: 40 },
      };
    }

    // Line & Bar (default)
    return {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: xData },
      yAxis: { type: "value" },
      series: [
        {
          type,
          data: yData,
          smooth: type === "line",
          itemStyle: type === "bar" ? { color: "rgba(102, 126, 234, 0.8)" } : undefined,
        },
      ],
      grid: { left: 44, right: 20, top: 30, bottom: 40 },
    };
  }, [type, rows, xKey, yKey]);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption(option);

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [option]);

  return <div ref={ref} style={{ width: "100%", height }} />;
}
