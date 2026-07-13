"use client";

import { useRef, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Mic, Square, Volume2, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
];

type Status = "idle" | "recording" | "transcribing" | "thinking" | "speaking";

const STATUS_TEXT: Record<Status, string> = {
  idle: "Tap the mic and ask your question",
  recording: "Listening... tap to stop",
  transcribing: "Understanding what you said...",
  thinking: "Thinking about your answer...",
  speaking: "Speaking the answer...",
};

/** Encode an AudioBuffer to a 16-bit mono PCM WAV Blob (Sarvam-friendly). */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0);
  const dataLength = samples.length * 2;
  const ab = new ArrayBuffer(44 + dataLength);
  const view = new DataView(ab);
  const writeString = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([view], { type: "audio/wav" });
}

export default function VoicePage() {
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const busy = status !== "idle" && status !== "recording";

  async function startRecording() {
    setError(null);
    setTranscript("");
    setAnswer("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await processAudio();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
    } catch {
      setError("Microphone permission was denied.");
      setStatus("idle");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function processAudio() {
    // 1) Transcribe
    setStatus("transcribing");
    let said = "";
    try {
      const webm = new Blob(chunksRef.current, { type: "audio/webm" });
      const buf = await webm.arrayBuffer();
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const decoded = await ctx.decodeAudioData(buf);
      const wav = audioBufferToWav(decoded);
      ctx.close();

      const form = new FormData();
      form.append("file", wav, "recording.wav");
      form.append("language", language);

      const res = await fetch(`${API_URL}/api/v1/chat/transcribe`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.detail ?? `Server responded ${res.status}`);
      }
      const data = await res.json();
      said = (data?.data?.transcript ?? "").trim();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not transcribe audio.");
      setStatus("idle");
      return;
    }

    if (!said) {
      setError("I couldn't hear anything. Please try again.");
      setStatus("idle");
      return;
    }
    setTranscript(said);

    // 2) Ask the assistant
    setStatus("thinking");
    let reply = "";
    try {
      const res = await fetch(`${API_URL}/api/v1/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: said, language, context: {} }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      reply = data?.data?.response ?? "Sorry, I could not generate a response.";
    } catch {
      setError("Could not reach the assistant. Is the backend running?");
      setStatus("idle");
      return;
    }
    setAnswer(reply);

    // 3) Speak the answer
    await speak(reply);
  }

  function stopSpeaking() {
    audioRef.current?.pause();
    audioRef.current = null;
    setStatus("idle");
  }

  async function speak(text: string) {
    setStatus("speaking");
    try {
      const res = await fetch(`${API_URL}/api/v1/chat/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      const b64 = data?.data?.audio;
      if (!b64) throw new Error("No audio returned.");

      audioRef.current?.pause();
      const audio = new Audio(`data:audio/wav;base64,${b64}`);
      audioRef.current = audio;
      audio.onended = () => setStatus("idle");
      audio.onerror = () => {
        setError("Could not play the audio answer.");
        setStatus("idle");
      };
      await audio.play();
    } catch {
      // Text answer is already shown; just report playback failure.
      setError("Voice output failed, but you can read the answer above.");
      setStatus("idle");
    }
  }

  const recording = status === "recording";
  const speaking = status === "speaking";
  const processing = status === "transcribing" || status === "thinking";

  function handleMainButton() {
    if (recording) stopRecording();
    else if (speaking) stopSpeaking();
    else startRecording();
  }

  return (
    <FeatureShell
      title="Voice Assistant"
      description="Speak your farming question in your language and hear the answer aloud. Powered by Sarvam AI."
    >
      <div className="mb-6 flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Language:
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={busy || recording}
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm disabled:opacity-50"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="feature-card flex flex-col items-center py-10">
        <button
          onClick={handleMainButton}
          disabled={processing}
          className={`flex h-28 w-28 items-center justify-center rounded-full text-white shadow-lg transition-all disabled:opacity-60 ${
            recording || speaking
              ? "bg-red-600 hover:bg-red-700 animate-pulse"
              : "bg-rose-600 hover:bg-rose-700 hover:scale-105"
          }`}
          aria-label={
            recording
              ? "Stop recording"
              : speaking
                ? "Stop audio"
                : "Start recording"
          }
        >
          {processing ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : recording || speaking ? (
            <Square className="h-10 w-10" />
          ) : (
            <Mic className="h-12 w-12" />
          )}
        </button>

        <p className="mt-5 text-center text-gray-600 dark:text-gray-300">
          {STATUS_TEXT[status]}
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
      </div>

      {(transcript || answer) && (
        <div className="mt-6 space-y-4">
          {transcript && (
            <div className="feature-card">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                You said
              </p>
              <p className="text-gray-900 dark:text-white">{transcript}</p>
            </div>
          )}
          {answer && (
            <div className="feature-card">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Krishivaani says
                </p>
                <button
                  onClick={() => speak(answer)}
                  disabled={busy || recording}
                  className="inline-flex items-center gap-1 text-sm text-rose-600 hover:opacity-80 disabled:opacity-40"
                  aria-label="Replay answer"
                >
                  <Volume2 className="h-4 w-4" /> Replay
                </button>
              </div>
              <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
                {answer}
              </p>
            </div>
          )}
        </div>
      )}
    </FeatureShell>
  );
}
