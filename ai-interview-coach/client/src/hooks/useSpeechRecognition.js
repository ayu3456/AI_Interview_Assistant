import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = () => {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += piece + " ";
        } else {
          interimTranscript += piece;
        }
      }
      
      finalTranscriptRef.current = finalTranscript;
      setTranscript((finalTranscript + interimTranscript).trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "no-speech") return; // Ignore brief silence
      
      setError(
        event.error === "not-allowed"
          ? "Microphone access blocked. Please allow access."
          : `Error: ${event.error}`
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      // In continuous mode, it might end unexpectedly, we can handle restarts if needed
      // but for this UI pattern, we let the user re-click if it stops.
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    setError("");
    setTranscript("");
    finalTranscriptRef.current = "";
    setIsListening(true);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    
    recognitionRef.current.stop();
    setIsListening(false);
  };

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript,
    setError,
  };
};

export default useSpeechRecognition;
