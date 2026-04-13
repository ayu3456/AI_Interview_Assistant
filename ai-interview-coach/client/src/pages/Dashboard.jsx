import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowUpRightIcon,
  DocumentMagnifyingGlassIcon,
  TrophyIcon,
  ChartBarIcon,
  FireIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const scoreBadge = (score) => {
  if (score >= 7) return "bg-accent/15 text-accent border border-accent/30";
  if (score >= 5) return "bg-warning/15 text-warning border border-warning/30";
  return "bg-error/15 text-error border border-error/30";
};

const StatCard = ({ label, value, icon: Icon, subtext, color }) => (
  <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface/80 p-5 shadow-lg transition-all duration-200 hover:border-white/20">
    <div className="flex items-start justify-between">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <span className="text-xs text-textSecondary">{subtext}</span>
    </div>
    <div className="mt-4">
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs text-textSecondary">{label}</p>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="h-24 rounded-2xl border border-white/10 bg-surface/60 skeleton" />
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get("/api/interview/history");
        setSessions(data.sessions || []);
      } catch {
        toast.error("Failed to load interview history.");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const stats = useMemo(() => {
    if (!sessions.length) return { total: 0, avg: "—", best: "—", streak: 0 };
    const total = sessions.length;
    const scores = sessions.map((s) => s.feedback?.overall || 0);
    const avg = (scores.reduce((a, b) => a + b, 0) / total).toFixed(1);
    const best = Math.max(...scores).toFixed(1);

    // Compute consecutive-day streak (most recent first)
    const uniqueDays = [
      ...new Set(sessions.map((s) => new Date(s.createdAt).toDateString())),
    ];
    let streak = 0;
    const cursor = new Date();
    for (const _ of uniqueDays) {
      if (uniqueDays.includes(cursor.toDateString())) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return { total, avg, best, streak };
  }, [sessions]);

  const statCards = [
    {
      label: "Total Interviews",
      value: stats.total,
      icon: ClipboardDocumentListIcon,
      subtext: "all time",
      color: "bg-primary/15 text-primary",
    },
    {
      label: "Average Score",
      value: stats.avg,
      icon: ChartBarIcon,
      subtext: "out of 10",
      color: "bg-secondary/15 text-secondary",
    },
    {
      label: "Best Score",
      value: stats.best,
      icon: TrophyIcon,
      subtext: "personal best",
      color: "bg-warning/15 text-warning",
    },
    {
      label: "Day Streak",
      value: stats.streak,
      icon: FireIcon,
      subtext: "consecutive days",
      color: "bg-accent/15 text-accent",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Track your progress and revisit past feedback.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/setup")}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90"
        >
          <ArrowUpRightIcon className="h-4 w-4" />
          Start New Interview
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading
          ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Recent sessions */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white">Recent Interviews</h2>

        <div className="mt-4 space-y-3">
          {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}

          {!loading && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-white/15 bg-surface/40 p-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
                <DocumentMagnifyingGlassIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">No interviews yet</p>
                <p className="mt-1 text-sm text-textSecondary">
                  Complete your first mock interview to see results here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/setup")}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90"
              >
                Start Interview
              </button>
            </div>
          )}

          {!loading &&
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-surface/70 p-5 shadow-lg transition-all duration-200 hover:border-white/20 sm:flex-row sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-bold text-white">
                      {session.role}
                    </p>
                    <span className="text-textSecondary">·</span>
                    <p className="text-sm text-textSecondary">{session.company}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        session.difficulty === "Hard"
                          ? "bg-error/10 text-error"
                          : session.difficulty === "Medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {session.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-textSecondary">
                    {new Date(session.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {session.duration} questions · {session.mode}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${scoreBadge(
                      session.feedback?.overall || 0
                    )}`}
                  >
                    {session.feedback?.overall?.toFixed(1) ?? "—"} / 10
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/feedback", { state: { session } })}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                  >
                    View Feedback
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
