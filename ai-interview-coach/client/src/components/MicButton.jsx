import React from "react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

const MicButton = ({ isListening, disabled, onPress, onRelease }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings (only when recording) */}
      {isListening && (
        <>
          <span className="absolute h-28 w-28 animate-ping rounded-full bg-error/20" />
          <span className="absolute h-24 w-24 animate-ping rounded-full bg-error/30 [animation-delay:200ms]" />
        </>
      )}

      <button
        type="button"
        disabled={disabled}
        onMouseDown={onPress}
        onMouseUp={onRelease}
        onTouchStart={(e) => { e.preventDefault(); onPress(); }}
        onTouchEnd={(e) => { e.preventDefault(); onRelease(); }}
        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 shadow-xl transition-all duration-200 select-none
          ${disabled
            ? "cursor-not-allowed border-white/10 bg-surface opacity-50"
            : isListening
            ? "border-error bg-error/20 shadow-[0_0_24px_rgba(239,68,68,0.4)]"
            : "border-primary/50 bg-primary/15 hover:border-primary hover:bg-primary/25 hover:shadow-glow active:scale-95"
          }`}
      >
        <MicrophoneIcon
          className={`h-9 w-9 transition-colors duration-200 ${
            isListening ? "text-error" : "text-primary"
          }`}
        />
      </button>
    </div>
  );
};

export default MicButton;
