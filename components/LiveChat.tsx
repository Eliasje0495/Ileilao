"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as Ably from "ably";

const WA_NUMBER = "5511999990000"; // replace with real WhatsApp Business number

interface Msg {
  id: string;
  sender: "user" | "support";
  content: string;
  createdAt: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let s = localStorage.getItem("chat_session");
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem("chat_session", s);
  }
  return s;
}

export function LiveChat() {
  const [open, setOpen]         = useState(false);
  const [tab, setTab]           = useState<"chat" | "whatsapp">("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [unread, setUnread]     = useState(0);
  const [started, setStarted]   = useState(false); // visitor typed first message
  const [visitorName, setVisitorName] = useState("");
  const [waInput, setWaInput]   = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const ablyRef   = useRef<Ably.Realtime | null>(null);
  const sessionId = useRef<string>("");

  useEffect(() => {
    sessionId.current = getSessionId();
  }, []);

  // Load history
  const loadHistory = useCallback(async () => {
    if (!sessionId.current) return;
    const r = await fetch(`/api/chat?session=${sessionId.current}`);
    const d = await r.json();
    if (d.messages?.length) {
      setMessages(d.messages);
      setStarted(true);
    }
  }, []);

  // Connect Ably when chat opens
  useEffect(() => {
    if (!open || tab !== "chat" || ablyRef.current) return;

    (async () => {
      await loadHistory();
      try {
        const tokenRes = await fetch("/api/chat/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId.current }),
        });
        if (!tokenRes.ok) return;
        const tokenRequest = await tokenRes.json();

        const client = new Ably.Realtime({ authCallback: (_d, cb) => cb(null, tokenRequest) });
        ablyRef.current = client;

        const ch = client.channels.get(`chat:${sessionId.current}`);
        ch.subscribe("message", (msg) => {
          const m = msg.data as Msg;
          setMessages(prev => {
            if (prev.find(x => x.id === m.id)) return prev;
            return [...prev, m];
          });
          if (!open || tab !== "chat") setUnread(u => u + 1);
        });
      } catch { /* Ably not configured — fall back to polling */ }
    })();

    return () => {
      ablyRef.current?.close();
      ablyRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (open) setUnread(0);
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    if (!started) setStarted(true);

    const optimistic: Msg = { id: Date.now().toString(), sender: "user", content: text, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId.current, content: text, sender: "user" }),
    });
    setSending(false);
  }

  function openWhatsApp() {
    const text = waInput.trim()
      ? encodeURIComponent(waInput)
      : encodeURIComponent("Olá! Vim pelo site iLeilão e gostaria de mais informações.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(o => !o); setUnread(0); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
        aria-label="Abrir chat"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.373 2 11.7c0 1.896.542 3.665 1.48 5.16L2 22l5.35-1.427A10.13 10.13 0 0012 21.4c5.523 0 10-4.373 10-9.7S17.523 2 12 2zm5.07 13.77c-.213.597-1.243 1.142-1.698 1.183-.434.04-.858.198-2.887-.599-2.458-.983-4.026-3.483-4.147-3.645-.12-.162-.985-1.308-.985-2.495s.614-1.755.857-1.998c.214-.214.463-.268.617-.268h.444c.143 0 .337.054.528.508.199.474.675 1.646.735 1.766.06.12.1.262.02.423-.08.16-.12.26-.24.4-.12.14-.252.313-.36.42-.12.12-.244.25-.105.49.139.24.617.99 1.324 1.602.909.808 1.676 1.058 1.916 1.178.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.394.658 1.634.778.24.12.4.18.46.28.06.1.06.578-.152 1.177z"/>
          </svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "520px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">iL</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-none">iLeilão Suporte</p>
              <p className="text-green-100 text-xs mt-0.5">Normalmente responde em minutos</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["chat", "whatsapp"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors
                  ${tab === t ? "border-b-2 border-green-500 text-green-700" : "text-gray-400 hover:text-gray-600"}`}>
                {t === "chat" ? "💬 Chat ao vivo" : "📱 WhatsApp"}
              </button>
            ))}
          </div>

          {/* ── CHAT TAB ── */}
          {tab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ minHeight: 240, maxHeight: 320 }}>
                {!started && messages.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-2xl mb-2">👋</p>
                    <p className="text-sm font-semibold text-gray-800">Olá! Como podemos ajudar?</p>
                    <p className="text-xs text-gray-400 mt-1">Envie sua dúvida abaixo e responderemos em instantes.</p>
                  </div>
                )}
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug
                      ${m.sender === "user"
                        ? "bg-green-500 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      {m.content}
                      <div className={`text-[10px] mt-0.5 ${m.sender === "user" ? "text-green-100" : "text-gray-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 px-3 py-2.5 flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 bg-gray-50"
                />
                <button onClick={send} disabled={!input.trim() || sending}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ background: "#25D366" }}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* ── WHATSAPP TAB ── */}
          {tab === "whatsapp" && (
            <div className="flex-1 flex flex-col px-5 py-5 gap-4">
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.373 2 11.7c0 1.896.542 3.665 1.48 5.16L2 22l5.35-1.427A10.13 10.13 0 0012 21.4c5.523 0 10-4.373 10-9.7S17.523 2 12 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">iLeilão Suporte</p>
                  <p className="text-xs text-green-700">+55 11 99999-0000</p>
                  <p className="text-xs text-gray-400">Seg–Sex · 9h–18h</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Sua mensagem (opcional)</label>
                <textarea
                  rows={3}
                  value={waInput}
                  onChange={e => setWaInput(e.target.value)}
                  placeholder="Olá! Gostaria de saber mais sobre..."
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 resize-none bg-gray-50"
                />
              </div>

              <button onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.373 2 11.7c0 1.896.542 3.665 1.48 5.16L2 22l5.35-1.427A10.13 10.13 0 0012 21.4c5.523 0 10-4.373 10-9.7S17.523 2 12 2z"/>
                </svg>
                Abrir no WhatsApp
              </button>

              <p className="text-xs text-center text-gray-400">Será aberto o aplicativo ou WhatsApp Web</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
