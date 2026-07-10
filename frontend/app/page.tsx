"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  CloudRain,
  Shield,
  MessageCircle,
  FileText,
  BarChart3,
  Sparkles,
  Cpu,
  Database,
  LineChart,
  Boxes,
  Layers,
  Check,
  Globe,
  Leaf,
  Droplets,
  Recycle,
  Sprout,
} from "lucide-react";
import { COPY, LANGS, type Locale, type Item } from "@/lib/landing-i18n";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  CountUp,
  motion,
} from "@/components/motion";

const FEATURE_META = [
  { icon: Camera, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", glow: "rgba(5,150,105,0.45)", span: "lg:col-span-2" },
  { icon: Shield, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", glow: "rgba(217,119,6,0.4)", span: "" },
  { icon: CloudRain, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20", glow: "rgba(2,132,199,0.4)", span: "" },
  { icon: MessageCircle, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20", glow: "rgba(13,148,136,0.4)", span: "" },
  { icon: FileText, color: "text-lime-600", bg: "bg-lime-50 dark:bg-lime-900/20", glow: "rgba(101,163,13,0.4)", span: "" },
  { icon: BarChart3, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20", glow: "rgba(8,145,178,0.4)", span: "lg:col-span-2" },
];

const TECH_META = [Sparkles, Boxes, Cpu, Database, LineChart, Layers];

const STAT_VALUES = ["500K", "22.58×", "3", "5"];

const SOLUTION_STATUS: ("Live" | "Roadmap")[] = ["Live", "Live", "Live", "Roadmap"];

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");

  // Restore the visitor's previously chosen language.
  useEffect(() => {
    const saved = localStorage.getItem("krisisar-lang") as Locale | null;
    if (saved && LANGS.some((l) => l.code === saved)) setLocale(saved);
  }, []);

  function changeLang(code: Locale) {
    setLocale(code);
    localStorage.setItem("krisisar-lang", code);
  }

  const t = COPY[locale];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/70 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🌾</span> KrisiSar AI
          </span>

          <div className="flex items-center gap-3">
            <LanguageSelector locale={locale} onChange={changeLang} />
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center rounded-full bg-gradient-brand text-white px-5 py-2 text-sm font-semibold shadow-md transition-transform hover:scale-105"
            >
              {t.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/25 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "-4s" }}
        />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 -translate-x-1/2 bg-emerald-300/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 pt-16 pb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 px-4 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 mb-6"
          >
            <Sparkles className="w-4 h-4" /> {t.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5"
          >
            🌾 <span className="text-gradient-brand">KrisiSar AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-2xl md:text-3xl font-semibold text-green-600 dark:text-green-400 mb-4"
          >
            {t.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link
              href="/dashboard"
              className="btn-brand inline-flex items-center justify-center"
            >
              {t.getStarted} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="farmer-button bg-white/80 backdrop-blur dark:bg-gray-900/70 text-green-600 border-2 border-green-500 hover:bg-green-50 dark:hover:bg-gray-800 inline-flex items-center justify-center"
            >
              {t.watchDemo}
            </Link>
          </motion.div>

          {/* Clickable language pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {LANGS.map((l) => {
              const active = l.code === locale;
              return (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    active
                      ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              );
            })}
          </div>

          {/* Stats band */}
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STAT_VALUES.map((value, i) => (
              <StaggerItem key={i}>
                <div className="glass-card glow-hover h-full p-5 hover:-translate-y-1">
                  <div className="text-3xl font-extrabold text-gradient-brand">
                    <CountUp value={value} />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t.statLabels[i]}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container mx-auto px-4 py-20">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            {t.featuresHeading}
          </h2>
        </Reveal>
        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-5">
          {t.features.map((f: Item, i: number) => {
            const meta = FEATURE_META[i];
            const Icon = meta.icon;
            const wide = meta.span !== "";
            return (
              <StaggerItem key={i} className={meta.span}>
                <div
                  className={`group glow-hover relative h-full overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-all hover:-translate-y-1.5 ${
                    wide
                      ? "bg-gradient-to-br from-white to-green-50/60 dark:from-gray-900 dark:to-emerald-950/20"
                      : "bg-white dark:bg-gray-900"
                  }`}
                  style={{ "--glow-color": meta.glow } as React.CSSProperties}
                >
                  {/* corner accent */}
                  <span
                    className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${meta.bg} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <div
                    className={`relative w-14 h-14 rounded-2xl ${meta.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-6`}
                  >
                    <Icon className={`w-7 h-7 ${meta.color}`} />
                  </div>
                  <h3 className={`relative font-bold mb-2 ${wide ? "text-2xl" : "text-xl"}`}>
                    {f.title}
                  </h3>
                  <p className="relative text-gray-600 dark:text-gray-300">{f.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      {/* ── Problem ── */}
      <section className="bg-red-50/60 dark:bg-red-950/20 py-20">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-red-700 dark:text-red-400">
              {t.problemHeading}
            </h2>
          </Reveal>
          <StaggerGroup className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
            {t.problems.map((p: Item, i: number) => (
              <StaggerItem key={i}>
                <div className="h-full bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border-l-4 border-red-400 transition-all hover:-translate-y-1 hover:shadow-md">
                  <h3 className="font-bold text-lg mb-2 text-red-600 dark:text-red-400">
                    ❌ {p.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="py-20 bg-gradient-to-b from-transparent via-green-50/40 to-transparent dark:via-green-950/10">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700 dark:text-green-400">
              {t.solutionHeading}
            </h2>
          </Reveal>
          <StaggerGroup className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
            {t.solutions.map((s: Item, i: number) => {
              const isLive = SOLUTION_STATUS[i] === "Live";
              return (
                <StaggerItem key={i}>
                <div
                  className="h-full bg-green-50 dark:bg-green-900/20 rounded-xl p-6 shadow-sm border-l-4 border-green-500 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-lg text-green-700 dark:text-green-400">
                      {isLive ? "✅ " : ""}
                      {s.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isLive
                          ? "bg-green-600 text-white"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {isLive ? t.live : t.comingSoon}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{s.desc}</p>
                </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Climate impact / SDG band ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 py-20 text-white">
        <div className="absolute -top-20 -left-16 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-24 -right-10 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4">
          <Reveal>
            <p className="text-center text-emerald-200 font-semibold tracking-wide uppercase text-sm mb-3">
              Sustainability at the core
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Technology for a Climate-Resilient Future
            </h2>
            <p className="text-center text-emerald-50/90 max-w-2xl mx-auto mb-12">
              Every feature is designed to cut resource waste, protect yields
              against climate volatility, and put sustainable practices within
              reach of every farmer.
            </p>
          </Reveal>

          {/* Impact metrics */}
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { icon: Droplets, label: "Water-smart irrigation", value: "Less waste" },
              { icon: Leaf, label: "Reduced chemical overuse", value: "Greener inputs" },
              { icon: Recycle, label: "Resource efficiency", value: "Lower costs" },
              { icon: Sprout, label: "Climate resilience", value: "Protected yields" },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <StaggerItem key={i}>
                  <div className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-lime-300" />
                    <div className="font-bold text-lg">{m.value}</div>
                    <div className="text-sm text-emerald-100/80 mt-1">{m.label}</div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          {/* SDG alignment */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-emerald-100/90 font-medium mr-1">
                Aligned with UN Sustainable Development Goals:
              </span>
              {[
                "SDG 2 · Zero Hunger",
                "SDG 13 · Climate Action",
                "SDG 1 · No Poverty",
              ].map((sdg) => (
                <span
                  key={sdg}
                  className="rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur"
                >
                  {sdg}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Technology ── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
              {t.techHeading}
            </h2>
          </Reveal>
          <StaggerGroup className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {t.tech.map((tech: Item, i: number) => {
              const Icon = TECH_META[i];
              return (
                <StaggerItem key={i}>
                <div
                  className="group h-full rounded-2xl bg-white dark:bg-gray-950 p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-green-400 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="w-11 h-11 rounded-lg bg-gradient-brand-soft flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{tech.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tech.desc}
                  </p>
                </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-lime-600 px-6 py-16 text-center text-white shadow-xl">
              <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float-slow" />
              <div
                className="absolute -bottom-20 -left-10 w-72 h-72 bg-lime-300/10 rounded-full blur-2xl animate-float-slow"
                style={{ animationDelay: "-3s" }}
              />
              <h2 className="relative text-3xl md:text-5xl font-bold mb-4">
                {t.ctaHeading}
              </h2>
              <p className="relative text-lg text-green-50 mb-8 max-w-2xl mx-auto">
                {t.ctaSubtitle}
              </p>
              <Link
                href="/signup"
                className="relative farmer-button bg-white text-green-700 hover:bg-green-50 inline-flex items-center"
              >
                {t.ctaButton} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-3 flex items-center justify-center gap-2">
            <span>🌾</span> {t.footerTagline}
          </p>
          <p className="text-gray-400 text-sm">{t.footerPowered}</p>
          <div className="mt-6 flex gap-6 justify-center text-sm">
            <Link href="/docs" className="hover:text-green-400 inline-flex items-center gap-1">
              <FileText className="w-4 h-4" /> {t.docs}
            </Link>
            <Link
              href="https://github.com/Ritik-Gupta8/KrisiSar-AI"
              className="hover:text-green-400"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Compact language dropdown for the header. */
function LanguageSelector({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (l: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium hover:border-green-400 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span>{current.flag}</span>
        <span>{current.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute right-0 mt-2 z-50 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
          >
            {LANGS.map((l) => {
              const active = l.code === locale;
              return (
                <li key={l.code}>
                  <button
                    onClick={() => {
                      onChange(l.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 ${
                      active ? "text-green-600 font-semibold" : ""
                    }`}
                  >
                    <span>
                      {l.flag} {l.label}
                    </span>
                    {active && <Check className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
