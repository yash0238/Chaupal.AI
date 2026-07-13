"use client";

import { useRef, useState } from "react";
import { FeatureShell } from "@/components/FeatureShell";
import { Send, Mic, Square, Volume2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
];

/**
 * Encode an AudioBuffer to a 16-bit mono PCM WAV Blob.
 * Browsers record WebM/Opus, but Sarvam's ASR is most reliable with WAV, so
 * we decode + re-encode before uploading.
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0); // mono: first channel
  const dataLength = samples.length * 2;
  const arrayBuffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function sendMessage(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language, context: {} }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data = await res.json();
      const reply =
        data?.data?.response ?? "Sorry, I could not generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setError(
        "Could not reach the backend. Make sure the FastAPI server is running at " +
          API_URL
      );
    } finally {
      setLoading(false);
    }
  }

  // --- Voice input: record -> WAV -> transcribe -> auto-send ---
  async function startRecording() {
    setError(null);
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
        await handleRecordedAudio();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone permission was denied.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function handleRecordedAudio() {
    setTranscribing(true);
    try {
      const webmBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const arrayBuf = await webmBlob.arrayBuffer();
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const decoded = await ctx.decodeAudioData(arrayBuf);
      const wavBlob = audioBufferToWav(decoded);
      ctx.close();

      const form = new FormData();
      form.append("file", wavBlob, "recording.wav");
      form.append("language", language);

      const res = await fetch(`${API_URL}/api/v1/chat/transcribe`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.detail ?? `Server responded ${res.status}`);
      }
      const data = await res.json();
      const transcript = (data?.data?.transcript ?? "").trim();
      if (transcript) {
        await sendMessage(transcript);
      } else {
        setError("Could not hear anything. Please try again.");
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Voice transcription failed."
      );
    } finally {
      setTranscribing(false);
    }
  }

  function stopSpeaking() {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeakingIndex(null);
  }

  // --- Voice output: read a reply aloud via TTS ---
  async function playMessage(text: string, index: number) {
    // Tapping the speaker again while it's playing stops it.
    if (speakingIndex === index) {
      stopSpeaking();
      return;
    }
    setError(null);
    setSpeakingIndex(index);
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
      audio.onended = () => setSpeakingIndex(null);
      audio.onerror = () => setSpeakingIndex(null);
      await audio.play();
    } catch {
      setError("Could not play audio. Voice output needs a Sarvam API key.");
      setSpeakingIndex(null);
    }
  }

  return (
    <FeatureShell
      title="Ask Krishivaani"
      description="Multilingual AI assistant — type or speak your farming question."
    >
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Language:
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="feature-card min-h-[400px] flex flex-col">
        <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[50vh]">
          {messages.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">
              Ask something like &quot;Should I irrigate my rice today?&quot; —
              or tap the mic and speak.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.content}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => playMessage(msg.content, i)}
                    disabled={speakingIndex !== null && speakingIndex !== i}
                    className="ml-2 mt-1 inline-flex items-center text-green-700 dark:text-green-400 hover:opacity-80 disabled:opacity-40 align-middle"
                    aria-label={
                      speakingIndex === i ? "Stop audio" : "Listen to this answer"
                    }
                    title={speakingIndex === i ? "Stop" : "Listen"}
                  >
                    {speakingIndex === i ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          {(loading || transcribing) && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2 text-gray-500">
                {transcribing ? "Transcribing..." : "Thinking..."}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-2" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading || transcribing}
            className={`rounded-full px-4 py-3 inline-flex items-center gap-2 disabled:opacity-50 ${
              recording
                ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300"
            }`}
            aria-label={recording ? "Stop recording" : "Record voice question"}
            title={recording ? "Stop" : "Speak"}
          >
            {recording ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your question..."
            className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3"
            aria-label="Chat message"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || transcribing}
            className="rounded-full bg-green-600 text-white px-6 py-3 hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </FeatureShell>
  );
}
