"use client";

import { useEffect, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { apiRequest, ApiError } from "@/lib/api";
import { Loader2, Database, BarChart3, Sprout, MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface YieldByCrop {
  crop_type?: string;
  avg_yield?: number;
  farms?: number;
}
interface RiskByState {
  state?: string;
  avg_risk?: number;
  farms?: number;
}
interface DiseaseSpread {
  diseases_count?: number;
  farms?: number;
}
interface FarmInsights {
  yield_by_crop?: YieldByCrop[];
  risk_by_state?: RiskByState[];
  disease_spread?: DiseaseSpread[];
}

const PIE_COLORS = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444", "#6b7280"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<FarmInsights | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await apiRequest<FarmInsights>(
          "/api/v1/analytics/farm-insights",
          { timeoutMs: 30_000 }
        );
        if (!active) return;
        setInsights(data ?? null);
      } catch (err) {
        if (!active) return;
        // BigQuery not configured / table not loaded yet.
        setUnavailable(true);
        if (!(err instanceof ApiError)) console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const yieldByCrop = insights?.yield_by_crop ?? [];
  const riskByState = (insights?.risk_by_state ?? []).slice(0, 10);
  const diseaseSpread = (insights?.disease_spread ?? []).map((d) => ({
    ...d,
    label:
      d.diseases_count === 0
        ? "No disease"
        : `${d.diseases_count} disease${(d.diseases_count ?? 0) > 1 ? "s" : ""}`,
  }));

  const hasData =
    yieldByCrop.length > 0 || riskByState.length > 0 || diseaseSpread.length > 0;

  return (
    <FeatureShell
      title="Analytics"
      description="Farm performance intelligence across yield, risk, and disease — powered by BigQuery over 500K farm records."
    >
      {loading && (
        <div className="feature-card flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">
            Loading analytics from BigQuery...
          </span>
        </div>
      )}

      {!loading && (unavailable || !hasData) && (
        <div className="feature-card text-center py-12">
          <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">
            Analytics not populated yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-4">
            This dashboard reads the farm-performance dataset from BigQuery.
            Load the 500K synthetic rows into the{" "}
            <code>farm_perf_raw</code> table (CSV upload with auto-detect), then
            refresh.
          </p>
          <p className="text-sm text-gray-500">
            Generate the CSV with{" "}
            <code>python analytics/generate_synthetic_data.py</code>, then upload
            it in the BigQuery console.
          </p>
        </div>
      )}

      {!loading && !unavailable && hasData && (
        <div className="space-y-6">
          {yieldByCrop.length > 0 && (
            <div className="feature-card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-600" /> Average yield by
                crop (kg)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldByCrop}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="crop_type" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="avg_yield"
                      name="Avg yield (kg)"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {riskByState.length > 0 && (
            <div className="feature-card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" /> Average risk score
                by state (top 10)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskByState} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="state" width={110} />
                    <Tooltip />
                    <Bar
                      dataKey="avg_risk"
                      name="Avg risk"
                      fill="#f97316"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {diseaseSpread.length > 0 && (
            <div className="feature-card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-500" /> Disease spread
                across farms
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseSpread}
                      dataKey="farms"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {diseaseSpread.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </FeatureShell>
  );
}
