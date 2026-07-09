"use client";

import { useRef, useState, useEffect } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Upload, Loader2, AlertTriangle, Leaf, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Keep in sync with backend validation (defense in depth)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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
  "Other",
];

interface Treatment {
  immediate?: string[];
  preventive?: string[];
  organic?: string[];
  chemical?: string[];
}

interface Diagnosis {
  disease?: string;
  confidence?: number;
  severity?: string;
  description?: string;
  symptoms?: string[];
  causes?: string[];
  treatment?: Treatment;
  affectedParts?: string[];
  spreadRisk?: string;
  economicImpact?: string;
}

const severityColor: Record<string, string> = {
  none: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export default function DiagnosisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileSelect(selected: File | null) {
    setError(null);
    setResult(null);

    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Please upload a JPEG or PNG image.");
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError("Image is too large. Maximum size is 10MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function clearImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyze() {
    if (!file || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);

    // Abort if the request takes longer than 90s so the UI never hangs
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (cropType) formData.append("crop_type", cropType);

      const res = await fetch(`${API_URL}/api/v1/diagnosis/analyze`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Server responded ${res.status}: ${detail.slice(0, 200)}`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Analysis failed");
      setResult(json.data as Diagnosis);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(
          "The request timed out. The backend may be restarting — check the server terminal, then try again."
        );
      } else {
        setError(
          err instanceof TypeError
            ? `Could not reach the backend at ${API_URL}. Is the FastAPI server running?`
            : err instanceof Error
              ? err.message
              : "Something went wrong."
        );
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  const confidencePct =
    result?.confidence != null ? Math.round(result.confidence * 100) : null;

  return (
    <FeatureShell
      title="Crop Diagnosis"
      description="Upload a crop photo for instant AI disease detection powered by Gemini Vision."
    >
      {/* Upload card */}
      <div className="feature-card">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: image picker */}
          <div>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files?.[0] ?? null);
              }}
              className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 transition-colors aspect-square flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Selected crop"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <Upload className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-medium">Click or drag a photo here</p>
                  <p className="text-sm">JPEG or PNG, up to 10MB</p>
                </div>
              )}
            </div>
            {previewUrl && (
              <button
                onClick={clearImage}
                className="mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" /> Remove image
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Right: options + action */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">
              Crop type (optional)
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 mb-4"
            >
              <option value="">Select crop...</option>
              {CROP_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Adding the crop type helps the AI give a more accurate diagnosis.
            </p>

            <button
              onClick={analyze}
              disabled={!file || loading}
              className="mt-auto rounded-full bg-green-600 text-white py-3 font-semibold hover:bg-green-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4" /> Diagnose crop
                </>
              )}
            </button>
          </div>
        </div>

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

      {/* Result */}
      {result && (
        <div className="feature-card mt-6 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.disease ?? "Unknown"}
            </h2>
            {result.severity && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  severityColor[result.severity.toLowerCase()] ??
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {result.severity} severity
              </span>
            )}
            {confidencePct != null && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {confidencePct}% confidence
              </span>
            )}
          </div>

          {result.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {result.description}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <ListBlock title="Symptoms" items={result.symptoms} />
            <ListBlock title="Causes" items={result.causes} />
            <ListBlock
              title="✅ Immediate actions"
              items={result.treatment?.immediate}
            />
            <ListBlock
              title="🛡️ Preventive measures"
              items={result.treatment?.preventive}
            />
            <ListBlock
              title="🌿 Organic options"
              items={result.treatment?.organic}
            />
            <ListBlock
              title="🧪 Chemical options"
              items={result.treatment?.chemical}
            />
          </div>

          {result.economicImpact && (
            <div className="mt-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                Potential economic impact
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {result.economicImpact}
              </p>
            </div>
          )}

          <p className="mt-6 text-xs text-gray-400">
            AI-generated guidance. For high-severity cases, consult a local
            agriculture officer before applying chemicals.
          </p>
        </div>
      )}
    </FeatureShell>
  );
}

function ListBlock({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-gray-700 dark:text-gray-300 text-sm flex gap-2"
          >
            <span className="text-green-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
