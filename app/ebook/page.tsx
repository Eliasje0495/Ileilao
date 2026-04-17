"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const TOPICS = [
  { icon: "⚖️", title: "Como funciona um leilão de imóveis", desc: "Entenda o processo completo do início ao arremate." },
  { icon: "💰", title: "Por que comprar em leilão é vantajoso", desc: "Descontos reais de 20% a 80% — veja como calcular." },
  { icon: "📋", title: "Tipos de leilão: judicial e extrajudicial", desc: "Diferenças, riscos e oportunidades em cada modalidade." },
  { icon: "🏦", title: "Imóveis de bancos — alienação fiduciária", desc: "Como bancos vendem imóveis retomados de inadimplentes." },
  { icon: "🪪", title: "Quem pode participar de um leilão", desc: "Requisitos de KYC, caução e habilitação online." },
  { icon: "🔨", title: "Passo a passo para dar um lance", desc: "Da descoberta do lote até o pagamento final." },
  { icon: "📜", title: "Como ler e entender um edital", desc: "Os 10 pontos que você precisa checar antes de qualquer lance." },
  { icon: "🏠", title: "Registro e transferência do imóvel", desc: "Carta de arrematação, ITBI e registro em cartório." },
  { icon: "📍", title: "Imóvel ocupado — o que fazer", desc: "Seus direitos e como funciona a imissão na posse." },
  { icon: "📈", title: "Estratégias para investidores", desc: "Como identificar lotes com maior potencial de valorização." },
];

export default function EbookPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", uf: "", interesse: "", tipo: [] as string[], faixa: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleTipo(t: string) {
    setForm((f) => ({
      ...f,
      tipo: f.tipo.includes(t) ? f.tipo.filter((x) => x !== t) : [...f.tipo, t],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/ebook-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Erro ao enviar. Tente novamente.");
      return;
    }

    router.push("/ebook/obrigado");
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-black text-blue-600 tracking-tight">i</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">Leilão</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-800 transition">Entrar</Link>
            <Link href="/auth/register" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              Cadastre-se grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero + Form */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-blue-100 mb-5">
              📖 E-book gratuito
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              LEILÃO DE IMÓVEIS<br />
              <span className="text-yellow-400">DO ZERO</span>
            </h1>
            <p className="text-blue-100 text-base leading-relaxed mb-6 max-w-sm">
              Um guia completo para você aprender os principais conceitos sobre leilões de imóveis e dar lances nas melhores oportunidades com segurança.
            </p>
            <div className="flex flex-col gap-2">
              {["100% gratuito — sem cartão de crédito", "Enviado imediatamente para o seu e-mail", "Linguagem simples, sem juridiquês"].map(b => (
                <div key={b} className="flex items-center gap-2 text-sm text-blue-100">
                  <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {b}
                </div>
              ))}
            </div>

            {/* Ebook mockup */}
            <div className="mt-8 hidden md:flex items-end gap-3">
              <div className="w-32 h-44 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-2xl flex flex-col items-center justify-center p-3 rotate-[-3deg]">
                <div className="text-blue-900 text-[10px] font-black text-center leading-tight">
                  LEILÃO DE<br/>IMÓVEIS<br/>DO ZERO
                </div>
                <div className="mt-2 text-[8px] text-blue-800 font-semibold text-center">iLeilão</div>
              </div>
              <div className="w-28 h-40 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-xl flex flex-col items-center justify-center p-3 rotate-[2deg] opacity-70">
                <div className="text-white text-[10px] font-black text-center leading-tight">
                  GUIA<br/>COMPLETO
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-gray-900">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Receba o e-book grátis</h2>
                <p className="text-xs text-gray-400 mb-4">Preencha os dados abaixo — leva menos de 1 minuto.</p>

                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text" required value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="email" required value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <input
                      type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                      placeholder="WhatsApp (com DDD): +55 11 9 0000-0000"
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>
                  <select
                    value={form.uf} onChange={e => set("uf", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-700"
                  >
                    <option value="">Selecione seu estado</option>
                    {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>

                  {/* Interesse */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Qual é o seu interesse?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Uso próprio", "Investimento"].map(opt => (
                        <label key={opt} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition text-sm font-medium ${form.interesse === opt ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                          <input type="radio" name="interesse" value={opt} checked={form.interesse === opt} onChange={() => set("interesse", opt)} className="accent-blue-600" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tipo de imóvel */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Tipo de imóvel que busca</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Casas", "Apartamentos", "Comerciais", "Rurais"].map(tipo => (
                        <label key={tipo} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition text-sm font-medium ${form.tipo.includes(tipo) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                          <input type="checkbox" checked={form.tipo.includes(tipo)} onChange={() => toggleTipo(tipo)} className="accent-blue-600" />
                          {tipo}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Faixa de preço */}
                  <select
                    value={form.faixa} onChange={e => set("faixa", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-700"
                  >
                    <option value="">Faixa de preço de interesse</option>
                    <option value="ate200">Até R$ 200.000</option>
                    <option value="200-500">R$ 200.000 – R$ 500.000</option>
                    <option value="500-1m">R$ 500.000 – R$ 1.000.000</option>
                    <option value="1m-2m">R$ 1.000.000 – R$ 2.000.000</option>
                    <option value="2m-5m">R$ 2.000.000 – R$ 5.000.000</option>
                    <option value="acima5m">Acima de R$ 5.000.000</option>
                  </select>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black py-4 rounded-xl transition text-sm disabled:opacity-70 mt-1"
                  >
                    {loading ? "Enviando..." : "QUERO RECEBER O E-BOOK GRÁTIS →"}
                  </button>

                  <p className="text-center text-[10px] text-gray-400">
                    Ao enviar, você concorda com nossa{" "}
                    <Link href="/privacidade" className="underline">Política de Privacidade</Link>. Sem spam.
                  </p>
                </form>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">O QUE VOCÊ VAI APRENDER?</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            10 capítulos que cobrem tudo que você precisa saber para participar de leilões com segurança e aproveitar as melhores oportunidades.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TOPICS.map((t, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="text-sm font-bold text-gray-900 mb-1">{t.title}</div>
              <div className="text-xs text-gray-500">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-blue-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { num: "47.000+", label: "downloads" },
              { num: "4.9 ★", label: "avaliação média" },
              { num: "100%", label: "gratuito" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-yellow-400">{s.num}</div>
                <div className="text-sm text-blue-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Pronto para começar?</h2>
          <p className="text-blue-200 text-sm mb-6">Baixe grátis e comece a estudar hoje.</p>
          <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black px-8 py-4 rounded-2xl transition text-sm">
            BAIXAR E-BOOK GRÁTIS →
          </a>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 iLeilão. Todos os direitos reservados. — <Link href="/privacidade" className="hover:underline">Privacidade</Link> · <Link href="/termos" className="hover:underline">Termos</Link></p>
      </footer>
    </div>
  );
}
