"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

// ── Types ────────────────────────────────────────────────────────────────────
type Category = "fiduciaria" | "juridica" | "judicial";
type Step = "category" | "form" | "booking" | "done";

// ── Calendar helpers ─────────────────────────────────────────────────────────
const SLOT_HOURS  = [9, 10, 11, 14, 15, 16, 17];
const DAYS_PT     = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS_PT   = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES: { id: Category; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: "fiduciaria",
    label: "Alienação Fiduciária",
    sub: "Imóveis retomados por banco ou instituição financeira",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: "juridica",
    label: "Pessoa Jurídica",
    sub: "Empresa com bens, estoque ou imóveis para leiloar",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: "judicial",
    label: "Venda Judicial",
    sub: "Bens determinados por vara cível ou processo judicial",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 5.491z" />
      </svg>
    ),
  },
];

const CAT_LABEL: Record<Category, string> = {
  fiduciaria: "Alienação Fiduciária",
  juridica:   "Pessoa Jurídica",
  judicial:   "Venda Judicial",
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function QueroVenderPage() {
  const [step, setStep]           = useState<Step>("category");
  const [category, setCategory]   = useState<Category | null>(null);
  const [form, setForm]           = useState({ nome: "", email: "", telefone: "", empresa: "" });
  const [sending, setSending]     = useState(false);

  // Booking state
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selDate, setSelDate]     = useState<Date | null>(null);
  const [selHour, setSelHour]     = useState<number | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [booking, setBooking]     = useState(false);
  const [bookError, setBookError] = useState("");

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() { if (viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1); }
  function nextMonth() { if (viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1); }

  async function pickDate(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today || d.getDay()===0 || d.getDay()===6) return;
    setSelDate(d); setSelHour(null);
    const r = await fetch(`/api/booking?date=${isoDate(d)}`);
    const data = await r.json();
    setBookedSlots(data.slots ?? []);
  }

  function isBooked(h: number) {
    if (!selDate) return false;
    const dt = new Date(selDate); dt.setHours(h,0,0,0);
    return bookedSlots.includes(dt.toISOString());
  }

  async function submitLead() {
    setSending(true);
    await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, assunto: `Quero Vender — ${CAT_LABEL[category!]}`, mensagem: `Tipo: ${CAT_LABEL[category!]}\nEmpresa: ${form.empresa}` }),
    });
    setSending(false);
    setStep("booking");
  }

  async function confirmBooking() {
    if (!selDate || selHour === null) return;
    setBooking(true); setBookError("");
    const dt = new Date(selDate); dt.setHours(selHour,0,0,0);
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.nome, email: form.email, assunto: `Quero Vender — ${CAT_LABEL[category!]}`, date: dt.toISOString() }),
    });
    const data = await res.json();
    setBooking(false);
    if (!res.ok) { setBookError(data.error ?? "Erro ao agendar."); return; }
    setStep("done");
  }

  // ── STEP: CATEGORY ──────────────────────────────────────────────────────────
  if (step === "category") return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link href="/" className="text-xs text-gray-400 hover:text-blue-600 mb-8 inline-block">← Voltar ao início</Link>
        <h1 className="text-4xl font-light text-gray-800 mb-2">Quero vender</h1>
        <p className="text-gray-400 mb-10">Selecione a opção que melhor representa o que deseja vender:</p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => { setCategory(c.id); setStep("form"); }}
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center text-green-700 transition-colors">
                {c.icon}
              </div>
              <span className="text-sm font-semibold text-gray-800 leading-snug">{c.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">
          Dúvidas? <Link href="/contato" className="text-blue-600 hover:underline">Fale conosco</Link>
        </p>
      </div>
    </div>
  );

  // ── STEP: FORM ──────────────────────────────────────────────────────────────
  if (step === "form") return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />
      <div className="max-w-lg mx-auto px-4 py-16">
        <button onClick={() => setStep("category")} className="text-xs text-gray-400 hover:text-blue-600 mb-8 inline-flex items-center gap-1">← Voltar</button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            {CATEGORIES.find(c=>c.id===category)?.icon}
          </div>
          <div>
            <p className="text-xs text-gray-400">Tipo selecionado</p>
            <p className="text-sm font-semibold text-gray-800">{category ? CAT_LABEL[category] : ""}</p>
          </div>
        </div>

        <h1 className="text-3xl font-light text-gray-800 mb-8">Seus dados</h1>

        <div className="space-y-5">
          {[
            { label: "Nome Completo", key: "nome",     placeholder: "Nome Completo",               type: "text" },
            { label: "Email",         key: "email",    placeholder: "ola@empresa.com.br",           type: "email" },
            { label: "Telefone",      key: "telefone", placeholder: "+55 (11) 0000-0000",           type: "tel" },
            { label: "Empresa",       key: "empresa",  placeholder: "Informe a empresa, se houver", type: "text" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input type={f.type} value={form[f.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-300 transition" />
            </div>
          ))}
        </div>

        <button
          onClick={submitLead}
          disabled={sending || !form.nome || !form.email}
          className="w-full mt-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl transition disabled:opacity-60 text-sm">
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );

  // ── STEP: BOOKING (Calendly style) ──────────────────────────────────────────
  if (step === "booking") return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left dark panel */}
        <div className="md:w-72 flex-shrink-0 bg-[#1a1f2e] text-white p-8 flex flex-col gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">iLeilão</p>
            <h2 className="text-xl font-bold leading-snug">Reunião com especialista</h2>
          </div>

          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30 minutos
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Videochamada ou telefone
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seg–Sex · 9h às 18h
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-xs text-gray-400 mb-1">Tipo</p>
            <p className="text-sm font-semibold text-green-400">{category ? CAT_LABEL[category] : ""}</p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-xs text-gray-400 mb-3">O que vamos discutir:</p>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li className="flex items-start gap-1.5"><span className="text-green-400 mt-0.5">✓</span> Avaliação do seu bem</li>
              <li className="flex items-start gap-1.5"><span className="text-green-400 mt-0.5">✓</span> Documentação necessária</li>
              <li className="flex items-start gap-1.5"><span className="text-green-400 mt-0.5">✓</span> Prazos e processo</li>
              <li className="flex items-start gap-1.5"><span className="text-green-400 mt-0.5">✓</span> Planos e comissões</li>
            </ul>
          </div>
        </div>

        {/* Right: calendar */}
        <div className="flex-1 p-8">
          {selDate && selHour !== null ? (
            // Confirm screen
            <div>
              <button onClick={() => setSelHour(null)} className="text-xs text-gray-400 hover:text-blue-600 mb-6 inline-flex items-center gap-1">← Alterar horário</button>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-xl flex-shrink-0">📅</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} às {selHour}:00
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">30 min · Confirmação por e-mail</p>
                </div>
              </div>

              {bookError && <p className="text-xs text-red-600 mb-4">{bookError}</p>}

              <button onClick={confirmBooking} disabled={booking}
                className="w-full bg-[#1a1f2e] hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition text-sm disabled:opacity-60">
                {booking ? "Agendando..." : "Confirmar reunião"}
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base font-bold text-gray-900 mb-1">Selecione uma data e horário</h3>
              <p className="text-xs text-gray-400 mb-5">Fuso horário: Brasília (GMT-3)</p>

              {/* Month nav */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">‹</button>
                <span className="text-sm font-semibold text-gray-800">{MONTHS_PT[viewMonth]} {viewYear}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">›</button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_PT.map(d => <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>)}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-y-0.5 mb-6">
                {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_,i) => {
                  const day = i+1;
                  const d = new Date(viewYear, viewMonth, day);
                  const dow = d.getDay();
                  const isPast = d < today;
                  const isWE = dow===0||dow===6;
                  const isSel = selDate?.getDate()===day && selDate?.getMonth()===viewMonth && selDate?.getFullYear()===viewYear;
                  const disabled = isPast || isWE;
                  return (
                    <button key={day} onClick={() => !disabled && pickDate(day)}
                      className={`text-xs py-2 rounded-lg mx-0.5 transition-colors font-medium
                        ${disabled ? "text-gray-300 cursor-default" : "hover:bg-green-50 hover:text-green-700 text-gray-700 cursor-pointer"}
                        ${isSel ? "!bg-[#1a1f2e] !text-white" : ""}`}>
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              {selDate && (
                <>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {selDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {SLOT_HOURS.map(h => {
                      const taken = isBooked(h);
                      const active = selHour === h;
                      return (
                        <button key={h} disabled={taken} onClick={() => !taken && setSelHour(h)}
                          className={`py-3 rounded-xl text-sm font-semibold border transition-colors
                            ${taken ? "bg-gray-50 text-gray-300 border-gray-100 cursor-default" : "border-[#1a1f2e] text-[#1a1f2e] hover:bg-[#1a1f2e] hover:text-white"}
                            ${active ? "!bg-[#1a1f2e] !text-white" : ""}`}>
                          {h}:00
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ── STEP: DONE ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reunião agendada!</h1>
        <p className="text-sm text-gray-500 mb-2">
          Confirmação enviada para <strong>{form.email}</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Nossa equipe entrará em contato para confirmar os detalhes da reunião.
        </p>
        <Link href="/" className="inline-block bg-[#1a1f2e] text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition text-sm">
          Voltar ao início →
        </Link>
      </div>
    </div>
  );
}
