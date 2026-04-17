"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Session { sessionId: string; lastMessage: string; lastAt: string; unread: number; }
interface Msg    { id: string; sender: "user" | "support"; content: string; createdAt: string; }

export function AdminChatClient() {
  const [sessions, setSessions]   = useState<Session[]>([]);
  const [active, setActive]       = useState<string | null>(null);
  const [messages, setMessages]   = useState<Msg[]>([]);
  const [reply, setReply]         = useState("");
  const [sending, setSending]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    const r = await fetch("/api/chat/sessions");
    const d = await r.json();
    setSessions(d.sessions ?? []);
  }, []);

  const loadMessages = useCallback(async (sid: string) => {
    const r = await fetch(`/api/chat?session=${sid}`);
    const d = await r.json();
    setMessages(d.messages ?? []);
  }, []);

  useEffect(() => {
    loadSessions();
    const t = setInterval(loadSessions, 10000);
    return () => clearInterval(t);
  }, [loadSessions]);

  useEffect(() => {
    if (!active) return;
    loadMessages(active);
    const t = setInterval(() => loadMessages(active), 5000);
    return () => clearInterval(t);
  }, [active, loadMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendReply() {
    const text = reply.trim();
    if (!text || !active || sending) return;
    setSending(true);
    setReply("");
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: active, content: text, sender: "support" }),
    });
    await loadMessages(active);
    setSending(false);
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Session list */}
      <div className="w-64 border-r border-gray-100 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Conversas</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">Nenhuma conversa ainda.</p>
          )}
          {sessions.map(s => (
            <button key={s.sessionId} onClick={() => setActive(s.sessionId)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors
                ${active === s.sessionId ? "bg-green-50" : "hover:bg-gray-50"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold text-gray-700 truncate">
                  Visitante {s.sessionId.slice(0, 8)}
                </span>
                {s.unread > 0 && (
                  <span className="w-4 h-4 bg-green-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {s.unread}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{s.lastMessage}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">
                {new Date(s.lastAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {active ? (
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-semibold text-gray-700">Visitante {active.slice(0, 8)}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === "support" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-snug
                  ${m.sender === "support"
                    ? "bg-green-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                  {m.content}
                  <div className={`text-[10px] mt-0.5 ${m.sender === "support" ? "text-green-100" : "text-gray-400"}`}>
                    {new Date(m.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
            <input value={reply} onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply()}
              placeholder="Responder..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 bg-gray-50" />
            <button onClick={sendReply} disabled={!reply.trim() || sending}
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition"
              style={{ background: "#25D366" }}>
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
}
