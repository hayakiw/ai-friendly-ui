"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore, type EditableField } from "../store";

type PromptAction = {
  action:
    | "navigate_to_detail"
    | "navigate_to_edit"
    | "navigate_to_list"
    | "update_field"
    | "save"
    | "unknown";
  customer_id?: number | null;
  field?: EditableField | null;
  value?: string | null;
  message: string;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function SearchBar() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [focused, setFocused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalPromptRef = useRef("");
  const router = useRouter();
  const pathname = usePathname();
  const { customers, editDraft, updateDraftField, commitDraft, showToast } =
    useStore();

  const currentPage: "list" | "detail" | "edit" = pathname.endsWith("/edit")
    ? "edit"
    : pathname.startsWith("/customers/")
      ? "detail"
      : "list";

  const currentCustomerId = (() => {
    const match = pathname.match(/\/customers\/(\d+)/);
    return match ? Number(match[1]) : null;
  })();

  const executeAction = useCallback(
    (action: PromptAction) => {
      switch (action.action) {
        case "navigate_to_detail":
          if (action.customer_id != null) {
            router.push(`/customers/${action.customer_id}`);
            showToast(action.message);
          }
          break;
        case "navigate_to_edit":
          if (action.customer_id != null) {
            router.push(`/customers/${action.customer_id}/edit`);
            showToast(action.message);
          }
          break;
        case "navigate_to_list":
          router.push("/");
          showToast(action.message);
          break;
        case "update_field":
          if (editDraft && action.field && action.value != null) {
            updateDraftField(action.field, action.value);
            showToast(action.message);
          } else {
            showToast("編集画面で実行してください");
          }
          break;
        case "save":
          if (editDraft) {
            commitDraft();
            showToast(action.message);
            router.push(`/customers/${editDraft.id}`);
          } else {
            showToast("編集画面で実行してください");
          }
          break;
        case "unknown":
        default:
          showToast(action.message || "解釈できませんでした");
      }
    },
    [router, editDraft, updateDraftField, commitDraft, showToast],
  );

  const submitPrompt = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: text,
            context: {
              current_page: currentPage,
              current_customer_id: currentCustomerId,
              customers: customers.map((c) => ({ id: c.id, name: c.name })),
            },
          }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data: PromptAction = await res.json();
        executeAction(data);
        setPrompt("");
      } catch (err) {
        showToast(
          `エラー: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      currentPage,
      currentCustomerId,
      customers,
      executeAction,
      showToast,
    ],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      finalPromptRef.current = transcript;
      setPrompt(transcript);
    };
    recognition.onend = () => {
      setListening(false);
      const text = finalPromptRef.current;
      if (text.trim()) submitPrompt(text);
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error !== "aborted" && event.error !== "no-speech") {
        showToast(`音声認識エラー: ${event.error}`);
      }
    };
    recognitionRef.current = recognition;
  }, [submitPrompt, showToast]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitPrompt(prompt);
  }

  function toggleMic() {
    const rec = recognitionRef.current;
    if (!rec) {
      showToast("このブラウザは音声入力に対応していません");
      return;
    }
    if (listening) {
      rec.stop();
      return;
    }
    finalPromptRef.current = "";
    setPrompt("");
    try {
      rec.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }

  const isAiActive = focused || listening;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative rounded-md transition-shadow ${
          isAiActive
            ? `ai-glow-ring ${listening ? "ai-glow-ring--listening" : ""}`
            : "border border-[#2979ff]/30 bg-gradient-to-r from-[#eaf2ff] to-white shadow-[0_0_0_3px_rgba(41,121,255,0.06)]"
        }`}
      >
        <div
          className={`flex items-center gap-2 rounded-[6px] px-3 py-2 ${
            isAiActive ? "bg-white" : ""
          }`}
        >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2979ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
          <path d="M19 14l0.7 2.1L22 17l-2.3 0.9L19 20l-0.7-2.1L16 17l2.3-0.9z" />
        </svg>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={loading}
          placeholder={
            listening
              ? "聞き取り中... どうぞお話しください"
              : "AIに指示: 例) 山田さんの詳細を開いて / 住所を〜に変更して / 保存して"
          }
          className="flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="rounded bg-[#2979ff] px-4 py-1 text-[12px] font-medium text-white shadow-sm transition hover:bg-[#1e6fe6] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "実行中" : "実行"}
        </button>
        <button
          type="button"
          onClick={toggleMic}
          disabled={!micSupported || loading}
          title={
            micSupported
              ? listening
                ? "停止"
                : "音声入力を開始"
              : "このブラウザは音声入力非対応"
          }
          className={`relative flex h-7 w-7 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40 ${
            listening
              ? "border-red-500 bg-red-500 text-white"
              : "border-slate-300 bg-white text-slate-600 hover:border-[#2979ff] hover:text-[#2979ff]"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
          {listening && (
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
          )}
        </button>
        </div>
      </div>
    </form>
  );
}
