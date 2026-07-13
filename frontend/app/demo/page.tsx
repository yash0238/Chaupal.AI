import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = { title: "Demo - Chaupal.AI" };

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="text-gradient-brand">Live Demo</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Explore Chaupal.AI&apos;s decision intelligence tools. The chat
          assistant is fully wired to the backend — the rest are ready to
          connect.
        </p>

        <Link
          href="/dashboard"
          className="btn-brand inline-flex items-center"
        >
          Open Dashboard <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
