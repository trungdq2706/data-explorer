import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";

type Props = {
  type: "line" | "bar";
  rows: any[];
  xKey: string;
  yKey: string;
  height?: number;
};

export default function EChart({ type, rows, xKey, yKey, height = 380 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const option = useMemo(() => {
    const xData = rows.map((r) => r[xKey]);
    const yData = rows.map((r) => Number(r[yKey] ?? 0));

    return {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: xData },
      yAxis: { type: "value" },
      series: [
        {
          type,
          data: yData,
          smooth: type === "line",
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
