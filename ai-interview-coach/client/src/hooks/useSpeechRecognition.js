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
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${piece}`.trim();
        } else {
          interimTranscript += piece;
        }
      }
      const combined = `${finalTranscriptRef.current} ${interimTranscript}`.trim();
      setTranscript(combined);
    };

    recognition.onerror = (event) => {
      setError(
        event.error === "not-allowed"
          ? "Microphone access blocked. Please allow access."
          : "Speech recognition error. Please try again."
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      return;
    }
    setError("");
    setTranscript("");
    finalTranscriptRef.current = "";
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      return;
    }
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
