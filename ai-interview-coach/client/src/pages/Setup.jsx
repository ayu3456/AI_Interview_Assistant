import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CodeBracketIcon,
  ServerIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  RectangleStackIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  MicrophoneIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const roleOptions = [
  { label: "Frontend Developer", icon: CodeBracketIcon, desc: "HTML/CSS/JS, React, performance" },
  { label: "Backend Developer",  icon: ServerIcon,           desc: "APIs, databases, Node.js" },
  { label: "Full Stack",         icon: ArrowsRightLeftIcon,  desc: "End-to-end web dev questions" },
  { label: "DSA Round",          icon: CpuChipIcon,          desc: "Algorithms & data structures" },
  { label: "System Design",      icon: RectangleStackIcon,   desc: "Design scalable systems" },
  { label: "Behavioral",         icon: UserGroupIcon,        desc: "STAR method, soft skills" },
];

const companyOptions = [
  { label: "Google",    color: "text-[#4285f4]", bg: "bg-[#4285f4]/10 border-[#4285f4]/30" },
  { label: "Amazon",    color: "text-[#ff9900]", bg: "bg-[#ff9900]/10 border-[#ff9900]/30" },
  { label: "Microsoft", color: "text-[#00a4ef]", bg: "bg-[#00a4ef]/10 border-[#00a4ef]/30" },
  { label: "Meta",      color: "text-[#0668e1]", bg: "bg-[#0668e1]/10 border-[#0668e1]/30" },
  { label: "Startup",   color: "text-accent",    bg: "bg-accent/10 border-accent/30" },
  { label: "Generic",   color: "text-textSecondary", bg: "bg-white/5 border-white/10" },
];

const difficultyOptions = [
  { label: "Easy",   desc: "Fundamental concepts & basics",        color: "text-accent",   ring: "border-accent/40   bg-accent/10" },
  { label: "Medium", desc: "Application & problem-solving depth",  color: "text-warning",  ring: "border-warning/40  bg-warning/10" },
  { label: "Hard",   desc: "Internals, edge cases, tradeoffs",     color: "text-error",    ring: "border-error/40    bg-error/10" },
];

const durationOptions = [
  { label: "5 Questions",  value: 5,  desc: "~10–15 minutes" },
  { label: "10 Questions", value: 10, desc: "~20–30 minutes" },
];

const modeOptions = [
  { label: "Text Mode",  icon: ChatBubbleLeftRightIcon, desc: "Type your answers in chat" },
  { label: "Voice Mode", icon: MicrophoneIcon,           desc: "Speak answers, AI replies by voice" },
];

/* ─────────────────────────────────────────── */

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    role: "",
    company: "",
    difficulty: "",
    duration: 5,
    mode: "Text Mode",
  });

  const steps = useMemo(
    () => [
      { title: "Select Role",       key: "role",       options: roleOptions },
      { title: "Select Company",    key: "company",    options: companyOptions },
      { title: "Select Difficulty", key: "difficulty", options: difficultyOptions },
      { title: "Select Duration",   key: "duration",   options: durationOptions },
      { title: "Select Mode",       key: "mode",       options: modeOptions },
    ],
    []
  );

  const currentStep = steps[step];

  const getOptionValue = (opt) => opt.value ?? opt.label;

  const handleSelect = (opt) => {
    setForm((prev) => ({ ...prev, [currentStep.key]: getOptionValue(opt) }));
  };

  const isSelected = (opt) =>
    form[currentStep.key] === getOptionValue(opt);

  const canProceed = Boolean(form[currentStep.key]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      navigate("/interview", { state: form });
    }
  };

  const stepTitles = ["Role", "Company", "Difficulty", "Duration", "Mode"];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-extrabold text-white">{currentStep.title}</h1>
          <span className="text-sm text-textSecondary">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        {/* Step dots */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  i < step
                    ? "bg-primary text-white"
                    : i === step
                    ? "border-2 border-primary text-primary"
                    : "border border-white/15 text-textSecondary"
                }`}
              >
                {i < step ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`hidden text-[10px] sm:block ${
                  i === step ? "text-primary" : "text-textSecondary"
                }`}
              >
                {stepTitles[i]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentStep.options.map((opt) => {
          const selected = isSelected(opt);
          const Icon = opt.icon;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                selected
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-white/10 bg-surface/70 hover:border-primary/40"
              }`}
            >
              {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <CheckIcon className="h-3 w-3 text-white" />
                </span>
              )}
              {Icon && (
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 ${
                    selected ? "bg-primary/20 text-primary" : "bg-white/5 text-textSecondary"
                  } ${opt.bg || ""}`}
                >
                  <Icon className={`h-5 w-5 ${opt.color || ""}`} />
                </div>
              )}
              <div>
                <span
                  className={`block text-sm font-bold transition-colors duration-200 ${
                    selected ? "text-white" : "text-white"
                  }`}
                >
                  {opt.label}
                </span>
                {opt.desc && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-textSecondary">
                    {opt.desc}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary chips */}
      {step > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {["role", "company", "difficulty", "duration", "mode"]
            .slice(0, step)
            .map((key) => (
              <span
                key={key}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {key === "duration" ? `${form[key]} Questions` : form[key]}
              </span>
            ))}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/30 disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90 disabled:opacity-40"
        >
          {step === steps.length - 1 ? "🚀 Start Interview" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default Setup;
