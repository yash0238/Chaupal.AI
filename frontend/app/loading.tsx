import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center gap-4">
      <div className="text-5xl animate-float-slow">🌾</div>
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-medium">Loading Krishivaani…</span>
      </div>
    </div>
  );
}
