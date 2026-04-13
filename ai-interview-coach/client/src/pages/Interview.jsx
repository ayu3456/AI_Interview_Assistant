import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import api from "../utils/api";
import ChatBubble from "../components/ChatBubble";
import MicButton from "../components/MicButton";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { cancelSpeech, speakText } from "../utils/textToSpeech";

const Interview = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const config = state || null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const chatEndRef = useRef(null);
  // Guard against StrictMode double-invocation of the initial message effect
  const startedRef = useRef(false);
  // Keep transcript ref in sync so voice-release handler has fresh value
  const transcriptRef = useRef("");

  const {
    isSupported,
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    setTranscript,
    setError: setSpeechError,
  } = useSpeechRecognition();

  // Mirror transcript state into ref for stale-closure safety
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const totalQuestions = config?.duration || 5;

  // Redirect to setup if no config
  useEffect(() => {
    if (!config) navigate("/setup");
  }, [config, navigate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cancel any ongoing speech when unmounting
  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  // Scroll to bottom whenever messages or loading state change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const parseFeedback = (text) => {
    if (!text) return null;
    if (!text.includes('"type"') || !text.includes('"feedback"')) return null;
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1) return null;
    try {
      const json = JSON.parse(text.slice(first, last + 1));
      return json.type === "feedback" ? json : null;
    } catch {
      return null;
    }
  };

  const saveAndExit = useCallback(
    async (feedback, finalMessages) => {
      setIsEnding(true);
      try {
        await api.post("/api/interview/save", {
          role: config.role,
          company: config.company,
          difficulty: config.difficulty,
          duration: totalQuestions,
          mode: config.mode,
          messages: finalMessages,
          feedback: {
            overall: feedback.overall,
            technical: feedback.technical,
            communication: feedback.communication,
            problemSolving: feedback.problemSolving,
            confidence: feedback.confidence,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            topics: feedback.topics,
            summary: feedback.summary,
          },
        });
        navigate("/feedback", {
          state: {
            session: {
              role: config.role,
              company: config.company,
              difficulty: config.difficulty,
              duration: totalQuestions,
              mode: config.mode,
              messages: finalMessages,
              feedback,
              createdAt: new Date().toISOString(),
            },
          },
        });
      } catch {
        toast.error("Unable to save interview session.");
        setIsEnding(false);
      }
    },
    [config, navigate, totalQuestions]
  );

  const handleAiReply = useCallback(
    async (reply, updatedMessages) => {
      const feedback = parseFeedback(reply);
      if (feedback) {
        await saveAndExit(feedback, updatedMessages);
        return;
      }
      const nextMessages = [...updatedMessages, { role: "assistant", content: reply }];
      setMessages(nextMessages);
      setQuestionIndex((prev) => Math.min(prev + 1, totalQuestions));

      if (config?.mode === "Voice Mode") {
        try {
          setIsSpeaking(true);
          await speakText(reply);
        } catch {
          // non-fatal — user can still type
        } finally {
          setIsSpeaking(false);
        }
      }
    },
    [config, saveAndExit, totalQuestions]
  );

  // Kick off the interview with an empty message array (gets first question from AI)
  useEffect(() => {
    if (!config || startedRef.current) return;
    startedRef.current = true;

    const startInterview = async () => {
      setLoading(true);
      try {
        const { data } = await api.post("/api/interview/message", {
          messages: [],
          role: config.role,
          company: config.company,
          difficulty: config.difficulty,
          totalQuestions,
        });
        await handleAiReply(data.reply, []);
      } catch {
        toast.error("Unable to start the interview. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    startInterview();
  }, [config, totalQuestions, handleAiReply]);

  const sendMessage = useCallback(
    async (content) => {
      const trimmed = content.trim();
      if (!trimmed || loading) return;

      const updatedMessages = [...messages, { role: "user", content: trimmed }];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const { data } = await api.post("/api/interview/message", {
          messages: updatedMessages,
          role: config.role,
          company: config.company,
          difficulty: config.difficulty,
          totalQuestions,
        });
        await handleAiReply(data.reply, updatedMessages);
      } catch {
        toast.error("Failed to send message. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, config, totalQuestions, handleAiReply]
  );

  const handleSend = () => sendMessage(input);

  const handleEnd = () => {
    if (loading || isEnding) return;
    sendMessage("end interview");
  };

  const handleVoicePress = () => {
    if (!isSupported) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    if (isSpeaking) {
      toast.error("Wait for the AI to finish speaking.");
      return;
    }
    if (loading) return;
    setTranscript("");
    setSpeechError("");
    transcriptRef.current = "";
    startListening();
  };

  // Use the ref value, not the stale closure over `transcript`
  const handleVoiceRelease = () => {
    stopListening();
    setTimeout(() => {
      const captured = transcriptRef.current.trim();
      if (captured) sendMessage(captured);
    }, 400);
  };

  // Format timer
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const formattedTime = `${mins}:${secs}`;

  if (!config) return null;

  const difficultyColor =
    config.difficulty === "Hard"
      ? "text-error bg-error/10 border-error/30"
      : config.difficulty === "Medium"
      ? "text-warning bg-warning/10 border-warning/30"
      : "text-accent bg-accent/10 border-accent/30";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary font-medium">
            {config.role}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-textSecondary">
            {config.company}
          </span>
          <span className={`rounded-full border px-3 py-1 font-medium ${difficultyColor}`}>
            {config.difficulty}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-textSecondary">
            Q {Math.min(Math.max(questionIndex, 1), totalQuestions)}/{totalQuestions}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-textSecondary">
            <ClockIcon className="h-3.5 w-3.5" />
            {formattedTime}
          </span>
        </div>

        <button
          type="button"
          onClick={handleEnd}
          disabled={loading || isEnding}
          className="flex items-center gap-1.5 rounded-full border border-error/40 bg-error/10 px-4 py-2 text-sm font-semibold text-error transition-all duration-200 hover:bg-error/20 disabled:opacity-50"
        >
          <XMarkIcon className="h-4 w-4" />
          {isEnding ? "Saving..." : "End Interview"}
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 scrollbar-hide">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((message, index) => (
            <ChatBubble key={index} role={message.role} content={message.content} />
          ))}

          {/* Typing indicator */}
          {loading && !isEnding && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                <span className="text-xs font-bold text-primary">AI</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {isEnding && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-surface/80 py-6 text-sm text-textSecondary">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Generating your feedback report...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-3xl">
          {config.mode === "Text Mode" ? (
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your answer and press Enter..."
                disabled={loading || isEnding}
                className="flex-1 rounded-full border border-white/10 bg-surface px-5 py-3 text-sm text-white placeholder-textSecondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || isEnding || !input.trim()}
                className="flex-shrink-0 rounded-full bg-primary p-3 text-white shadow-glow transition-all duration-200 hover:opacity-90 disabled:opacity-40"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              {transcript && (
                <div className="w-full rounded-xl border border-primary/20 bg-surface/80 px-4 py-3 text-sm text-white">
                  {transcript}
                </div>
              )}
              {speechError && (
                <p className="text-sm text-error">{speechError}</p>
              )}
              <p className="text-sm font-medium text-textSecondary h-5">
                {isSpeaking
                  ? "🔊 AI is speaking…"
                  : isListening
                  ? "🎙️ Listening — release to send"
                  : "Hold mic to speak your answer"}
              </p>
              <MicButton
                isListening={isListening}
                disabled={loading || isSpeaking || isEnding}
                onPress={handleVoicePress}
                onRelease={handleVoiceRelease}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
