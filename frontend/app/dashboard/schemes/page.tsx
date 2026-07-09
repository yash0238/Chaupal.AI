"use client";

import { useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { apiRequest, ApiError } from "@/lib/api";
import { Loader2, AlertTriangle, FileText, ExternalLink } from "lucide-react";

const STATES = [
  "Punjab",
  "Haryana",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Uttar Pradesh",
  "Bihar",
  "West Bengal",
  "Gujarat",
  "Other",
];
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
];

interface Scheme {
  name?: string;
  description?: string;
  eligibility?: string;
  benefits?: string;
  category?: string;
  applicationUrl?: string;
}

interface SchemeResult {
  schemes?: Scheme[];
  guidance?: string;
  totalSchemes?: number;
}

export default function SchemesPage() {
  const [farmSize, setFarmSize] = useState("2");
  const [crops, setCrops] = useState("Rice, Wheat");
  const [state, setState] = useState("Punjab");
  const [ownership, setOwnership] = useState("Owner");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SchemeResult | null>(null);

  async function find() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiRequest<SchemeResult>("/api/v1/schemes/find-eligible", {
        method: "POST",
        body: {
          farmSize: parseFloat(farmSize) || 0,
          crops: crops
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          state,
          landOwnership: ownership,
          language,
        },
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeatureShell
      title="Government Schemes"
      description="Find schemes you may be eligible for, with AI-generated application guidance."
    >
      <div className="feature-card">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Farm size (acres)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Crops (comma-separated)
            </label>
            <input
              type="text"
              value={crops}
              onChange={(e) => setCrops(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Land ownership
            </label>
            <select
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
              <option value="Sharecropper">Sharecropper</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={find}
          disabled={loading}
          className="rounded-full bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Finding schemes...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" /> Find eligible schemes
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
        <div className="mt-6 space-y-4 animate-fade-in">
          {result.schemes && result.schemes.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {result.schemes.map((s, i) => (
                <div key={i} className="feature-card">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {s.name}
                    </h3>
                    {s.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 whitespace-nowrap">
                        {s.category}
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {s.description}
                    </p>
                  )}
                  {s.eligibility && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Eligibility:</span>{" "}
                      {s.eligibility}
                    </p>
                  )}
                  {s.benefits && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Benefits:</span> {s.benefits}
                    </p>
                  )}
                  {s.applicationUrl && (
                    <a
                      href={s.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.guidance && (
            <div className="feature-card">
              <h3 className="font-bold mb-2">How to apply</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {result.guidance}
              </p>
            </div>
          )}
        </div>
      )}
    </FeatureShell>
  );
}
