"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { apiRequest, getLocation, ApiError } from "@/lib/api";
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react";

const CROP_TYPES = [
  "Rice",
  "Wheat",
  "Cotton",
  "Sugarcane",
  "Maize",
  "Tomato",
  "Potato",
  "Onion",
  "Soybean",
];
const STAGES = ["seedling", "vegetative", "flowering", "fruiting", "maturity"];

interface RiskResult {
  overallScore?: number;
  riskLevel?: string;
  components?: {
    weatherRisk?: number;
    diseaseRisk?: number;
    cropHealthRisk?: number;
  };
  factors?: { weather?: string[]; disease?: string[]; crop?: string[] };
  actions?: { immediate?: string[]; shortTerm?: string[]; longTerm?: string[] };
}

const levelColor: Record<string, string> = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

export default function RiskScorePage() {
  const [crop, setCrop] = useState("Rice");
  const [stage, setStage] = useState("vegetative");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);

  async function calculate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { lat, lng } = await getLocation();
      // 1) fetch weather for the location
      const weather = await apiRequest<Record<string, unknown>>(
        `/api/v1/weather/current?latitude=${lat}&longitude=${lng}&forecast_days=7`
      );
      // 2) compute risk from weather + crop info
      const risk = await apiRequest<RiskResult>("/api/v1/risk/calculate", {
        method: "POST",
        body: {
          weatherData: weather,
          diseaseHistory: [],
          cropInfo: { type: crop, stage, ageDays: 45 },
          location: { lat, lng },
        },
      });
      setResult(risk);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const score = result?.overallScore ?? 0;
  const level = (result?.riskLevel ?? "low").toLowerCase();
  const color = levelColor[level] ?? "#6b7280";

  return (
    <FeatureShell
      title="Farm Risk Score"
      description="A 0–100 risk score combining live weather, disease conditions, and crop stage."
    >
      <div className="feature-card">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            >
              {CROP_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Crop stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 capitalize"
            >
              {STAGES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={calculate}
          disabled={loading}
          className="rounded-full bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Calculating...
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" /> Calculate risk score
            </>
          )}
        </button>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 text-sm"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="feature-card mt-6 animate-fade-in">
          {/* Score gauge */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${color} ${score * 3.6}deg, #e5e7eb 0deg)`,
              }}
            >
              <div className="absolute w-32 h-32 rounded-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold" style={{ color }}>
                  {score}
                </span>
                <span className="text-xs text-gray-500">out of 100</span>
              </div>
            </div>
            <span
              className="mt-3 px-4 py-1 rounded-full text-sm font-semibold uppercase"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {level} risk
            </span>
          </div>

          {/* Component breakdown */}
          <div className="space-y-3 mb-6">
            <ComponentBar label="Weather risk" value={result.components?.weatherRisk} />
            <ComponentBar label="Disease risk" value={result.components?.diseaseRisk} />
            <ComponentBar
              label="Crop health risk"
              value={result.components?.cropHealthRisk}
            />
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <ActionBlock
              title="🚨 Immediate"
              items={result.actions?.immediate}
              tone="bg-red-50 dark:bg-red-900/20"
            />
            <ActionBlock
              title="📅 This week"
              items={result.actions?.shortTerm}
              tone="bg-yellow-50 dark:bg-yellow-900/20"
            />
            <ActionBlock
              title="🌱 This season"
              items={result.actions?.longTerm}
              tone="bg-green-50 dark:bg-green-900/20"
            />
          </div>
        </div>
      )}
    </FeatureShell>
  );
}

function ComponentBar({ label, value }: { label: string; value?: number }) {
  const v = value ?? 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-medium">{v}/100</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${v}%`,
            backgroundColor:
              v >= 70 ? "#ef4444" : v >= 50 ? "#f97316" : v >= 30 ? "#eab308" : "#22c55e",
          }}
        />
      </div>
    </div>
  );
}

function ActionBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items?: string[];
  tone: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`rounded-xl p-4 ${tone}`}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
            <span>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
