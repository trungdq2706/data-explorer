"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { API_BASE_URL } from "@/config";

const EChart = dynamic(() => import("../../../components/EChart"), { ssr: false });

// Use API URL from config
const API_BASE = API_BASE_URL;

type DatasetItem = { id: string; label: string };
type FieldsRes = { dimensions: string[]; measures: string[] };
type ExploreQueryRes = { rows: any[] };

type ExploreState = {
  datasetId: string;
  dimension: string;
  measure: string;
  dateFrom: string;
  dateTo: string;
  platform: string;
  chartType: "line" | "bar" | "pie" | "scatter";
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  wrapper: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "40px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginTop: "8px",
  },
  filterCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column" as const,
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  select: {
    padding: "12px 14px",
    border: "2px solid #e8e8e8",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: "32px",
  },
  selectHover: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  input: {
    padding: "12px 14px",
    border: "2px solid #e8e8e8",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
  },
  inputHover: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
  },
  chartCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  chartHeader: {
    marginBottom: "20px",
  },
  chartTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "#222",
  },
  chartSubtitle: {
    fontSize: "13px",
    color: "#999",
    margin: 0,
  },
  errorMsg: {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#fee",
    color: "#c33",
    fontSize: "13px",
    fontWeight: "500",
    marginLeft: "12px",
    display: "inline-block",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    background: "rgba(102, 126, 234, 0.1)",
    color: "#667eea",
    marginTop: "4px",
  },
};

export default function ShareExplorePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [fields, setFields] = useState<FieldsRes | null>(null);

  const [state, setState] = useState<ExploreState>(() => {
    const today = new Date();
    const to = isoDate(today);
    const fromD = new Date(today);
    fromD.setDate(today.getDate() - 6);
    const from = isoDate(fromD);

    return { datasetId: "", dimension: "", measure: "", dateFrom: from, dateTo: to, platform: "", chartType: "bar" };
  });

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setPageError(null);

    fetch(`${API_BASE}/share/${token}/datasets`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: DatasetItem[]) => {
        setDatasets(data);
        if (data.length > 0) setState((p) => ({ ...p, datasetId: p.datasetId || data[0].id }));
      })
      .catch(() => {
        const mock: DatasetItem[] = [
          { id: "orders", label: "📦 Orders (Mock)" },
          { id: "livestream", label: "🔴 Livestream (Mock)" },
        ];
        setDatasets(mock);
        setState((p) => ({ ...p, datasetId: p.datasetId || mock[0].id }));
        setPageError(null);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !state.datasetId) return;
    setFields(null);

    fetch(`${API_BASE}/share/${token}/dataset/${state.datasetId}/fields`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data: FieldsRes) => {
        setFields(data);
        const dimDefault = data.dimensions.includes("dt") ? "dt" : data.dimensions[0] || "";
        const meaDefault = data.measures.includes("revenue") ? "revenue" : data.measures[0] || "";
        setState((p) => ({ ...p, dimension: p.dimension || dimDefault, measure: p.measure || meaDefault }));
      })
      .catch(() => {
        const mockFields = {
          dimensions: ["dt", "platform", "product_name"],
          measures: ["revenue", "orders"],
        };
        setFields(mockFields);
        setState((p) => ({
          ...p,
          dimension: p.dimension || "dt",
          measure: p.measure || "revenue",
        }));
        setPageError(null);
      });
  }, [token, state.datasetId]);

  async function runQuery() {
    if (!token) return;
    setRunError(null);

    if (!state.datasetId || !state.dimension || !state.measure) {
      setRunError("⚠️ Vui lòng chọn dataset, dimension và measure");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/share/${token}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_id: state.datasetId,
          dimension: state.dimension,
          measure: state.measure,
          date_from: state.dateFrom,
          date_to: state.dateTo,
          platform: state.platform ? state.platform : null,
          limit: 500,
          order: "asc",
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data: ExploreQueryRes = await res.json();
      setRows(data.rows || []);
    } catch {
      setRunError("❌ Query lỗi - vui lòng kiểm tra backend hoặc thử lại");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || !fields) return;
    if (!state.datasetId || !state.dimension || !state.measure) return;
    runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, fields, state.datasetId, state.dimension, state.measure]);

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={{ textAlign: "center", paddingTop: "100px" }}>
            <div style={{ fontSize: "18px", color: "#666" }}>⏳ Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={{ textAlign: "center", paddingTop: "100px" }}>
            <div style={{ fontSize: "18px", color: "#c33" }}>❌ {pageError}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Data Explorer</h1>
          <p style={styles.subtitle}>Khám phá dữ liệu của bạn một cách trực quan</p>
          <div style={styles.statusBadge}>Token: {token?.slice(0, 12)}...</div>
        </div>

        <div style={styles.filterCard}>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>📦 Dataset</label>
              <select
                value={state.datasetId}
                onChange={(e) => setState((p) => ({ ...p, datasetId: e.target.value, dimension: "", measure: "" }))}
                style={{ ...styles.select } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>📍 Dimension</label>
              <select
                value={state.dimension}
                onChange={(e) => setState((p) => ({ ...p, dimension: e.target.value }))}
                disabled={!fields}
                style={{ ...styles.select, opacity: !fields ? 0.5 : 1 } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!fields) return;
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {(fields?.dimensions || []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>📈 Measure</label>
              <select
                value={state.measure}
                onChange={(e) => setState((p) => ({ ...p, measure: e.target.value }))}
                disabled={!fields}
                style={{ ...styles.select, opacity: !fields ? 0.5 : 1 } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!fields) return;
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {(fields?.measures || []).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>� Loại Biểu Đồ</label>
              <select
                value={state.chartType}
                onChange={(e) => setState((p) => ({ ...p, chartType: e.target.value as any }))}
                style={styles.select as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="line">📈 Đường</option>
                <option value="bar">📊 Cột</option>
                <option value="pie">🥧 Tròn</option>
                <option value="scatter">⚫ Điểm</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>�📅 Từ</label>
              <input
                type="date"
                value={state.dateFrom}
                onChange={(e) => setState((p) => ({ ...p, dateFrom: e.target.value }))}
                style={styles.input as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>📅 Đến</label>
              <input
                type="date"
                value={state.dateTo}
                onChange={(e) => setState((p) => ({ ...p, dateTo: e.target.value }))}
                style={styles.input as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>📱 Platform (tùy chọn)</label>
              <input
                placeholder="vd: tiktok"
                value={state.platform}
                onChange={(e) => setState((p) => ({ ...p, platform: e.target.value }))}
                style={styles.input as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "20px" }}>
            <button
              onClick={runQuery}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                if (loading) return;
                Object.assign(e.currentTarget.style, {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                });
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, {
                  transform: "none",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                });
              }}
            >
              {loading ? "⏳ Đang chạy..." : "▶️ Chạy"}
            </button>
            {runError && <span style={styles.errorMsg}>{runError}</span>}
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              {state.chartType === "line" && "📈 Biểu đồ đường"}
              {state.chartType === "bar" && "📊 Biểu đồ cột"}
              {state.chartType === "pie" && "🥧 Biểu đồ tròn"}
              {state.chartType === "scatter" && "⚫ Biểu đồ điểm"}
            </h2>
            <p style={styles.chartSubtitle}>
              {state.dimension} × {state.measure} • {rows.length} hàng dữ liệu
            </p>
          </div>
          <EChart type={state.chartType} rows={rows} xKey={state.dimension} yKey={state.measure} height={450} />
        </div>
      </div>
    </div>
  );
}
