import Link from "next/link";
import {
  Camera,
  CloudRain,
  Shield,
  MessageCircle,
  FileText,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Dashboard - KrisiSar AI",
  description: "Your farm decision intelligence dashboard",
};

const features = [
  {
    href: "/dashboard/diagnosis",
    icon: Camera,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    title: "Crop Diagnosis",
    description: "Upload a crop photo for instant AI disease detection.",
  },
  {
    href: "/dashboard/risk-score",
    icon: Shield,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    title: "Farm Risk Score",
    description: "Real-time risk assessment from 0 to 100.",
  },
  {
    href: "/dashboard/weather",
    icon: CloudRain,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    title: "Weather Intelligence",
    description: "7-day forecast and irrigation recommendations.",
  },
  {
    href: "/dashboard/chat",
    icon: MessageCircle,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    title: "Ask KrisiSar",
    description: "Multilingual AI assistant for any farming question.",
  },
  {
    href: "/dashboard/schemes",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    title: "Government Schemes",
    description: "Find schemes you are eligible for.",
  },
  {
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    title: "Analytics",
    description: "Disease trends and data-driven insights.",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose a tool to get started with smarter farm decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="feature-card block hover:scale-[1.02] transition-transform"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
