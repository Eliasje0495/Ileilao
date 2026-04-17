"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSent(true);
  }

  const ASSUNTOS = [
    "Dúvida sobre leilão",
    "Problema com cadastro / KYC",
    "Problema com pagamento / caução",
    "Denúncia ou reclamação",
    "Parceria ou anunciar leilão",
    "Imprensa",
    "Outro",
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        {/* Left info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Fale conosco</h1>
          <p className="text-gray-500 text-sm mb-8 max-w-sm">
            Nossa equipe responde em até 1 dia útil. Para dúvidas rápidas, confira também o nosso{" "}
            <Link href="/como-funciona" className="text-blue-600 hover:underline">Como Funciona</Link>.
          </p>
          <div className="space-y-4">
            {[
              { icon: "✉️", label: "E-mail", value: "suporte@ileilao.com" },
              { icon: "📱", label: "WhatsApp", value: "+55 11 99999-0000" },
              { icon: "⏰", label: "Horário", value: "Seg–Sex, 9h–18h (BRT)" },
              { icon: "📍", label: "São Paulo", value: "SP, Brasil" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</div>
                  <div className="text-sm font-medium text-gray-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-xs font-semibold text-blue-800 mb-1">Central de Ajuda</p>
            <p className="text-xs text-blue-600 mb-3">Encontre respostas rápidas para as perguntas mais comuns.</p>
            <Link href="/como-funciona" className="text-xs font-semibold text-blue-700 hover:underline">
              Acessar Central de Ajuda →
            </Link>
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Mensagem enviada!</h2>
              <p className="text-sm text-gray-500">Responderemos em até 1 dia útil no e-mail informado.</p>
            </div>
          ) : (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-4">Enviar mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" required value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="Seu nome" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input type="email" required value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="Seu e-mail" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <select required value={form.assunto} onChange={e => set("assunto", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-700">
                  <option value="">Selecione o assunto</option>
                  {ASSUNTOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <textarea required value={form.mensagem} onChange={e => set("mensagem", e.target.value)}
                  placeholder="Descreva sua dúvida ou mensagem..." rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 text-sm">
                  {loading ? "Enviando..." : "Enviar mensagem"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
