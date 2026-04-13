export const pickVoice = () => {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  if (!voices.length) {
    return null;
  }
  const preferred = voices.find(
    (voice) => voice.name === "Google UK English Male"
  );
  return preferred || voices[0];
};

export const speakText = (text) => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Speech synthesis failed"));

    window.speechSynthesis.speak(utterance);
  });
};

export const cancelSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
