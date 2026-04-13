import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ScoreCard from "../components/ScoreCard";

/* ──────────────────────────── helpers ──────────────────────────── */

const CONFETTI_COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

const scoreColor = (val) => {
  if (val >= 7) return "#10b981";
  if (val >= 5) return "#f59e0b";
  return "#ef4444";
};

const scoreBg = (val) => {
  if (val >= 7) return "border-accent/30 bg-accent/10 text-accent";
  if (val >= 5) return "border-warning/30 bg-warning/10 text-warning";
  return "border-error/30 bg-error/10 text-error";
};

/* Circular progress ring (starts at top) */
const ScoreRing = ({ value, max = 10, size = 140, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value, 0), max) / max;
  const offset = circumference - circumference * pct;
  const color = scoreColor(value);

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1f1f2e"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </svg>
  );
};

/* Horizontal score bar */
const ScoreBar = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-sm">
      <span className="text-textSecondary">{label}</span>
      <span className="font-bold" style={{ color }}>
        {value}<span className="text-textSecondary font-normal">/10</span>
      </span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${(value / 10) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

/* ──────────────────────────── component ──────────────────────────── */

const Feedback = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const session = state?.session || null;
  const [showTranscript, setShowTranscript] = useState(false);
  const hasAnimated = useRef(false);

  const confetti = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: `${(i / 24) * 100}%`,
        delay: `${i * 60}ms`,
        size: `${8 + (i % 3) * 4}px`,
      })),
    []
  );

  // Trigger confetti animation once
  useEffect(() => {
    hasAnimated.current = true;
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-2xl border border-white/10 bg-surface/80 p-10 text-center">
          <p className="text-lg font-semibold text-white">No feedback data found.</p>
          <p className="mt-2 text-sm text-textSecondary">
            Complete an interview first to view your results.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { feedback, messages } = session;
  const overall = feedback?.overall ?? 0;
  const color = scoreColor(overall);

  const scores = [
    { label: "Technical Knowledge", key: "technical", color: "#7c3aed" },
    { label: "Communication",       key: "communication", color: "#3b82f6" },
    { label: "Problem Solving",     key: "problemSolving", color: "#f59e0b" },
    { label: "Confidence",          key: "confidence",     color: "#10b981" },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Confetti */}
      <div className="pointer-events-none fixed left-0 top-0 h-0 w-full overflow-visible">
        {confetti.map((piece, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: piece.left,
              top: "60px",
              width: piece.size,
              height: piece.size,
              background: piece.color,
              animationDelay: piece.delay,
            }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-textSecondary">Interview Complete 🎉</p>
            <h1 className="mt-1 text-3xl font-bold text-white">Your Feedback Report</h1>
            <p className="mt-1 text-sm text-textSecondary">
              {session.role} · {session.company} · {session.difficulty}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/setup")}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Practice Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90"
            >
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Score overview */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Ring card */}
          <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-lg">
            <p className="text-xs uppercase tracking-widest text-textSecondary">Overall Score</p>
            <div className="relative mt-5 flex items-center justify-center">
              <ScoreRing value={overall} />
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">
                  {overall.toFixed(1)}
                </span>
                <span className="text-xs text-textSecondary">/10</span>
              </div>
            </div>
            <span
              className={`mt-4 rounded-full border px-3 py-1 text-xs font-semibold ${scoreBg(overall)}`}
            >
              {overall >= 7 ? "Strong Performance" : overall >= 5 ? "Average" : "Needs Work"}
            </span>
            <p className="mt-4 text-center text-xs leading-relaxed text-textSecondary">
              {feedback.summary}
            </p>
          </div>

          {/* Sub-scores */}
          <div className="rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-lg">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-textSecondary">
              Score Breakdown
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {scores.map(({ label, key, color: c }) => (
                <ScoreBar key={key} label={label} value={feedback[key] ?? 0} color={c} />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {scores.map(({ label, key, color: c }) => (
                <ScoreCard
                  key={key}
                  label={label.split(" ")[0]}
                  value={`${feedback[key] ?? 0}/10`}
                  accent=""
                  style={{ color: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Strengths / Improvements / Topics */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Strengths */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircleIcon className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-white">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {(feedback.strengths || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-textSecondary">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="rounded-2xl border border-warning/20 bg-warning/5 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-warning" />
              <h3 className="font-semibold text-white">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {(feedback.improvements || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-textSecondary">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warning" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Topics */}
          <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <LightBulbIcon className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-white">Study Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(feedback.topics || []).map((topic, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transcript (collapsible) */}
        {messages && messages.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-lg">
            <button
              type="button"
              onClick={() => setShowTranscript((prev) => !prev)}
              className="flex w-full items-center justify-between text-left"
            >
              <h3 className="font-semibold text-white">Interview Transcript</h3>
              <span className="flex items-center gap-1 text-sm text-textSecondary">
                {showTranscript ? (
                  <>Hide <ChevronUpIcon className="h-4 w-4" /></>
                ) : (
                  <>Show <ChevronDownIcon className="h-4 w-4" /></>
                )}
              </span>
            </button>

            {showTranscript && (
              <div className="mt-5 space-y-3 max-h-96 overflow-y-auto scrollbar-hide pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      msg.role === "assistant"
                        ? "border-primary/20 bg-primary/5"
                        : "border-secondary/20 bg-secondary/5"
                    }`}
                  >
                    <p className="mb-1 text-xs uppercase tracking-wide text-textSecondary">
                      {msg.role === "assistant" ? "AI Interviewer" : "You"}
                    </p>
                    <p className="leading-relaxed text-white">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
