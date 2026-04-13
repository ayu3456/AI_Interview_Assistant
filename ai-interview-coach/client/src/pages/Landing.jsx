import React from "react";
import { Link } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  AdjustmentsHorizontalIcon,
  ChartBarSquareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "AI Interviewer",
    description:
      "A strict, role-specific AI conducts real interview sessions tailored to your target company.",
    icon: SparklesIcon,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    title: "Voice Mode",
    description:
      "Practice speaking aloud with live speech-to-text and natural voice replies from the AI.",
    icon: MicrophoneIcon,
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/20",
  },
  {
    title: "Instant Feedback",
    description:
      "Get a scored report on technical depth, communication, problem solving, and confidence.",
    icon: ClipboardDocumentCheckIcon,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
];

const steps = [
  {
    num: "01",
    title: "Configure your interview",
    description: "Choose role, company, difficulty, and duration in under 60 seconds.",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    num: "02",
    title: "Interview live",
    description: "Chat or speak with a strict AI interviewer — no hand-holding.",
    icon: RocketLaunchIcon,
  },
  {
    num: "03",
    title: "Review your report",
    description: "See your scores, strengths, gaps, and a curated study plan.",
    icon: ChartBarSquareIcon,
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "Frontend Engineer @ Flipkart",
    quote:
      "The AI felt like an actual Google interviewer. After a week of practice here, I aced my real loop with zero surprises.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    role: "Backend Developer @ Razorpay",
    quote:
      "Voice mode is a game-changer. Speaking under pressure is a skill — I built it here before the real thing.",
    rating: 5,
  },
  {
    name: "Aisha Rahman",
    role: "Full Stack Engineer @ Postman",
    quote:
      "The per-question feedback finally showed me where I was losing marks. Went from 5/10 to 8/10 in two weeks.",
    rating: 5,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-32 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />

        <div className="animate-fadeInUp space-y-6 relative z-10">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            AI-Powered Mock Interviews
          </span>
          <h1 className="text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
            Ace Your{" "}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
              Next Interview
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-textSecondary sm:text-lg">
            Practice realistic technical interviews with a strict AI interviewer. Get instant
            scored feedback, voice mode, and company-specific questions — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]"
            >
              Get Started Free
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
          <p className="text-xs text-textSecondary">
            No credit card required · Works in browser · Voice & text modes
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass-card rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${f.bg}`}
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-textSecondary">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">How it works</h2>
          <p className="mt-3 text-sm text-textSecondary">Three steps to a sharper interview game</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative rounded-2xl border border-white/10 bg-surface/60 p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
            >
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-white/5 select-none">
                {step.num}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-textSecondary">{step.description}</p>
              {i < steps.length - 1 && (
                <ArrowRightIcon className="absolute -right-3 top-10 hidden h-5 w-5 text-white/20 sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">What candidates say</h2>
            <p className="mt-2 text-sm text-textSecondary">Real results from real practice</p>
          </div>
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-primary opacity-60" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-textSecondary">"{t.quote}"</p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-textSecondary">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-surface to-surface p-10 text-center shadow-glow sm:p-14">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready for your mock interview?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-textSecondary sm:text-base">
              Join thousands of engineers who practice smarter — not harder. Start in under 2
              minutes.
            </p>
            <Link
              to="/signup"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
            >
              Start Practicing Now
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-textSecondary sm:flex-row sm:px-6">
          <span className="font-semibold text-white">AI Interview Coach</span>
          <span>© 2026 · Practice smarter. Interview sharper.</span>
          <div className="flex gap-5">
            <Link to="/signup" className="hover:text-white transition-colors duration-200">Get Started</Link>
            <Link to="/login" className="hover:text-white transition-colors duration-200">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
