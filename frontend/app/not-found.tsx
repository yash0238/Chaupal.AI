import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4 animate-float-slow">🌱</div>
      <h1 className="text-6xl font-extrabold text-gradient-brand mb-3">404</h1>
      <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        This field is empty
      </p>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to solid ground.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-brand inline-flex items-center justify-center">
          <Home className="w-5 h-5 mr-2" /> Home
        </Link>
        <Link
          href="/dashboard"
          className="farmer-button bg-white/80 backdrop-blur dark:bg-gray-900/70 text-green-600 border-2 border-green-500 hover:bg-green-50 dark:hover:bg-gray-800 inline-flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
