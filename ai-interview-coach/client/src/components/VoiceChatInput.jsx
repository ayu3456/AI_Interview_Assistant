import React, { useState, useEffect } from "react";
import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from "@heroicons/react/24/solid";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

/**
 * VoiceChatInput Component
 * 
 * Features:
 * - Toggle between Text and Voice mode
 * - Continuous recording until 'Send' is clicked
 * - Live transcription display
 * - Error handling for permissions/empty transcripts
 */
const VoiceChatInput = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript
  } = useSpeechRecognition();

  // Update input text as transcript changes in voice mode
  useEffect(() => {
    if (isVoiceMode && transcript) {
      setInputText(transcript);
    }
  }, [transcript, isVoiceMode]);

  const handleSend = () => {
    const finalMessage = inputText.trim();
    
    if (!finalMessage) return;

    // 1. Stop listening if we are in voice mode
    if (isListening) {
      stopListening();
    }

    // 2. Send the message to parent (Groq API handler)
    onSendMessage(finalMessage);

    // 3. Reset state
    setInputText("");
    setTranscript("");
  };

  const toggleMode = () => {
    if (isListening) stopListening();
    setIsVoiceMode(!isVoiceMode);
    setInputText("");
    setTranscript("");
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-error/10 text-error rounded-lg">
        Speech recognition is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-3xl mx-auto p-4 bg-surface rounded-2xl border border-white/10 shadow-xl">
      {/* Mode Toggle */}
      <div className="flex justify-end">
        <button
          onClick={toggleMode}
          className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-textSecondary transition-colors"
        >
          Switch to {isVoiceMode ? "Keyboard" : "Voice"} Input
        </button>
      </div>

      <div className="flex items-end gap-3">
        {isVoiceMode ? (
          <div className="flex-1 flex flex-col gap-2">
            {/* Live Transcript Display */}
            <div className={`min-h-[80px] p-4 rounded-xl border transition-all duration-300 ${
              isListening ? "border-primary/50 bg-primary/5" : "border-white/10 bg-white/5"
            }`}>
              {inputText || <span className="text-textSecondary italic">Your speech will appear here...</span>}
              
              {isListening && (
                <div className="flex gap-1 mt-2">
                  <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                  <span className="text-[10px] text-error font-bold uppercase tracking-wider">Recording</span>
                </div>
              )}
            </div>
            
            {error && <p className="text-xs text-error px-1">{error}</p>}
          </div>
        ) : (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[50px] max-h-40 p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        )}

        <div className="flex flex-col gap-2">
          {isVoiceMode && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all ${
                isListening 
                  ? "bg-error text-white animate-pulse" 
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              }`}
              title={isListening ? "Stop Recording" : "Start Recording"}
            >
              {isListening ? <StopIcon className="h-6 w-6" /> : <MicrophoneIcon className="h-6 w-6" />}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="p-3 rounded-full bg-primary text-white shadow-glow hover:opacity-90 disabled:opacity-40 disabled:shadow-none transition-all"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <p className="text-[10px] text-center text-textSecondary">
        {isVoiceMode 
          ? "Click the mic to start/stop speaking, then click send to submit." 
          : "Shift + Enter for new line."}
      </p>
    </div>
  );
};

export default VoiceChatInput;
