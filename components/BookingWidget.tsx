"use client";

import { useState, useEffect, useCallback } from "react";

const SLOT_HOURS = [9, 10, 11, 14, 15, 16, 17]; // available hours (lunch break 12-13)
const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const ASSUNTOS = [
  "Dúvida sobre leilão",
  "Cadastro de leiloeiro / parceria",
  "Problema com pagamento ou caução",
  "Demonstração da plataforma",
  "Imprensa / media",
  "Outro",
];

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function BookingWidget() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear]     = useState(today.getFullYear());
  const [viewMonth, setViewMonth]   = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [bookedSlots, setBookedSlots]   = useState<string[]>([]); // ISO strings of taken slots
  const [step, setStep]             = useState<"calendar" | "form" | "done">("calendar");
  const [form, setForm]             = useState({ name: "", email: "", assunto: "", notes: "" });
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

  // Fetch booked slots whenever selected date changes
  const fetchSlots = useCallback(async (d: Date) => {
    const res = await fetch(`/api/booking?date=${isoDate(d)}`);
    const data = await res.json();
    setBookedSlots(data.slots ?? []);
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function selectDate(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    const dow = d.getDay();
    if (dow === 0 || dow === 6) return; // no weekends
    setSelectedDate(d);
    setSelectedHour(null);
  }

  function isBooked(hour: number) {
    if (!selectedDate) return false;
    const dt = new Date(selectedDate);
    dt.setHours(hour, 0, 0, 0);
    return bookedSlots.includes(dt.toISOString());
  }

  async function confirm() {
    if (!selectedDate || selectedHour === null) return;
    setSaving(true); setError("");
    const dt = new Date(selectedDate);
    dt.setHours(selectedHour, 0, 0, 0);
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, date: dt.toISOString() }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao agendar."); return; }
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🗓️</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Reunião agendada!</h3>
        <p className="text-sm text-gray-500">
          Confirmação enviada para <strong>{form.email}</strong>.<br />
          Nossa equipe entrará em contato para confirmar o horário.
        </p>
      </div>
    );
  }

  return (
    <div>
      {step === "calendar" && (
        <>
          {/* Mini calendar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-sm">‹</button>
              <span className="text-sm font-semibold text-gray-800">
                {MONTHS_PT[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-sm">›</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_PT.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const d = new Date(viewYear, viewMonth, day);
                const dow = d.getDay();
                const isPast = d < today;
                const isWeekend = dow === 0 || dow === 6;
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === viewMonth && selectedDate?.getFullYear() === viewYear;
                const disabled = isPast || isWeekend;
                return (
                  <button key={day} type="button" onClick={() => !disabled && selectDate(day)}
                    className={`text-xs font-medium py-2 rounded-lg mx-0.5 transition-colors
                      ${disabled ? "text-gray-300 cursor-default" : "hover:bg-blue-50 text-gray-700 cursor-pointer"}
                      ${isSelected ? "!bg-blue-600 !text-white" : ""}`}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Horários disponíveis — {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
              </p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {SLOT_HOURS.map(h => {
                  const taken = isBooked(h);
                  const active = selectedHour === h;
                  return (
                    <button key={h} type="button" disabled={taken}
                      onClick={() => !taken && setSelectedHour(h)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors
                        ${taken ? "bg-gray-100 text-gray-300 border-gray-100 cursor-default" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
                        ${active ? "!bg-blue-600 !text-white !border-blue-600" : ""}`}>
                      {h}:00
                    </button>
                  );
                })}
              </div>
              {selectedHour !== null && (
                <button type="button" onClick={() => setStep("form")}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-sm">
                  Continuar →
                </button>
              )}
            </div>
          )}

          {!selectedDate && (
            <p className="text-xs text-gray-400 text-center mt-2">Selecione um dia útil no calendário acima.</p>
          )}
        </>
      )}

      {step === "form" && selectedDate && selectedHour !== null && (
        <>
          <button type="button" onClick={() => setStep("calendar")}
            className="text-xs text-gray-500 hover:text-blue-600 mb-4 inline-flex items-center gap-1">
            ‹ Alterar horário
          </button>
          <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-2xl">🗓️</span>
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} às {selectedHour}:00
              </p>
              <p className="text-xs text-blue-500">30 minutos · Videochamada ou telefone</p>
            </div>
          </div>

          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">{error}</div>}

          <div className="space-y-3">
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Seu nome *"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Seu e-mail *"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select required value={form.assunto} onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
              <option value="">Assunto da reunião *</option>
              {ASSUNTOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Observações (opcional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <button type="button"
              disabled={saving || !form.name || !form.email || !form.assunto}
              onClick={confirm}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-sm disabled:opacity-60">
              {saving ? "Agendando..." : "Confirmar agendamento"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
