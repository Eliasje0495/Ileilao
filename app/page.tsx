// app/page.tsx — iLeilão homepage
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HeroSearch } from "@/components/HeroSearch";

export const metadata: Metadata = {
  title: "Leilão de Imóveis, Veículos e Bens Online — iLeilão",
  description: "Encontre imóveis, veículos, máquinas e bens em leilões online em todo o Brasil com até 80% de desconto. Leilões judiciais e extrajudiciais. Cadastre-se grátis e dê seu lance!",
  keywords: ["leilão de imóveis", "leilão online", "leilão judicial", "leilão extrajudicial", "imóveis leilão", "leilão de veículos", "lance online"],
  openGraph: {
    title: "iLeilão — A plataforma de leilões online do Brasil",
    description: "Imóveis, veículos e bens com até 80% de desconto. Leilões judiciais e extrajudiciais.",
    url: "https://ileilao.com",
    type: "website",
  },
  alternates: { canonical: "https://ileilao.com" },
};


const FEATURED = [
  { id: "1", title: "Apartamento 3 quartos — Ibirapuera, São Paulo/SP", category: "Imóvel", discount: 42, price: "R$ 380.000", originalPrice: "R$ 655.000", date1: "23 Abr · 10h00", date2: "30 Abr · 10h00", image: "🏢", tag: "Itaú Unibanco", area: "98m² útil", badge: "Desocupado" },
  { id: "2", title: "Toyota Corolla 2022 — Rio de Janeiro/RJ", category: "Veículo", discount: 31, price: "R$ 68.000", originalPrice: "R$ 98.500", date1: "24 Abr · 14h00", date2: null, image: "🚗", tag: "Bradesco", area: null, badge: null },
  { id: "3", title: "Casa 4 quartos com piscina — Curitiba/PR", category: "Imóvel", discount: 38, price: "R$ 520.000", originalPrice: "R$ 840.000", date1: "25 Abr · 10h00", date2: "02 Mai · 10h00", image: "🏡", tag: "Caixa", area: "240m² útil", badge: "Desocupado" },
  { id: "4", title: "Terreno 800m² — Florianópolis/SC", category: "Imóvel", discount: 55, price: "R$ 180.000", originalPrice: "R$ 400.000", date1: "26 Abr · 11h00", date2: "03 Mai · 11h00", image: "🏗️", tag: "Santander", area: "800m² terreno", badge: null },
  { id: "5", title: "Escavadeira Caterpillar 320D — Belo Horizonte/MG", category: "Máquina", discount: 28, price: "R$ 210.000", originalPrice: "R$ 292.000", date1: "28 Abr · 09h00", date2: null, image: "🚜", tag: "Leilão Judicial", area: null, badge: null },
  { id: "6", title: "Conjunto Comercial 120m² — Brasília/DF", category: "Imóvel", discount: 47, price: "R$ 290.000", originalPrice: "R$ 547.000", date1: "29 Abr · 10h00", date2: "06 Mai · 10h00", image: "🏬", tag: "BB", area: "120m² útil", badge: "Desocupado" },
];

const PRICE_RANGES = [
  { label: "Até R$ 100 mil",         href: "/leiloes?maxPrice=100000" },
  { label: "R$ 100 mil – R$ 200 mil", href: "/leiloes?minPrice=100000&maxPrice=200000" },
  { label: "R$ 200 mil – R$ 500 mil", href: "/leiloes?minPrice=200000&maxPrice=500000" },
  { label: "R$ 500 mil – R$ 1 MM",    href: "/leiloes?minPrice=500000&maxPrice=1000000" },
  { label: "R$ 1 MM – R$ 5 MM",       href: "/leiloes?minPrice=1000000&maxPrice=5000000" },
  { label: "Acima de R$ 5 MM",        href: "/leiloes?minPrice=5000000" },
];

const DISCOUNT_RANGES = [
  { label: "Acima de 50% de desconto", href: "/leiloes?minDiscount=50", hot: true },
  { label: "Até 50% abaixo da avaliação", href: "/leiloes?minDiscount=40" },
  { label: "Até 40% abaixo da avaliação", href: "/leiloes?minDiscount=30" },
  { label: "Até 30% abaixo da avaliação", href: "/leiloes?minDiscount=20" },
  { label: "Até 20% abaixo da avaliação", href: "/leiloes?minDiscount=10" },
  { label: "Até 10% abaixo da avaliação", href: "/leiloes?minDiscount=0" },
];

const SELLERS = [
  { name: "Banco Itaú Unibanco", count: 181, href: "/leiloes?vendedor=itau" },
  { name: "Bradesco", count: 93, href: "/leiloes?vendedor=bradesco" },
  { name: "Caixa Econômica", count: 78, href: "/leiloes?vendedor=caixa" },
  { name: "Santander", count: 57, href: "/leiloes?vendedor=santander" },
  { name: "Banco do Brasil", count: 37, href: "/leiloes?vendedor=bb" },
  { name: "Judicial SP (TJSP)", count: 293, href: "/leiloes?vendedor=tjsp" },
  { name: "Banco Inter", count: 25, href: "/leiloes?vendedor=inter" },
  { name: "Sicoob", count: 121, href: "/leiloes?vendedor=sicoob" },
];

const HOW_IT_WORKS = [
  { step: "01", icon: "📝", title: "Cadastre-se grátis", desc: "Crie sua conta em 3 minutos com verificação de identidade 100% digital. KYC automático pelo celular." },
  { step: "02", icon: "🔍", title: "Encontre o lote ideal", desc: "Busque por imóveis, veículos ou bens com filtros avançados de localização, preço e desconto." },
  { step: "03", icon: "📄", title: "Leia o edital", desc: "Analise o edital, matrícula e documentos do lote antes de dar seu lance. Tudo disponível para download." },
  { step: "04", icon: "💰", title: "Deposite a caução", desc: "Realize o depósito de garantia via cartão ou PIX. Devolvido automaticamente se não arrematar." },
  { step: "05", icon: "🏆", title: "Dê seu lance", desc: "Participe ao vivo pelo computador ou celular. Lances em tempo real com auditoria em blockchain." },
];

const EDUCATIONAL = [
  { icon: "📖", title: "Como participar de um leilão",    href: "/como-funciona",     desc: "Guia completo do processo, do cadastro ao arremate" },
  { icon: "⚖️", title: "Leilões Judiciais vs Extrajudiciais", href: "/blog/judicial-extrajudicial", desc: "Entenda as diferenças e riscos de cada modalidade" },
  { icon: "🏠", title: "Imóvel ocupado: o que fazer?",   href: "/blog/imovel-ocupado", desc: "Saiba como proceder com a desocupação após o arremate" },
  { icon: "📋", title: "Glossário de leilões",           href: "/glossario",           desc: "Termos técnicos explicados de forma simples" },
];

const STATS = [
  { value: "R$ 60B+",  label: "Volume anual de leilões no Brasil" },
  { value: "12M+",     label: "Brasileiros participam por ano" },
  { value: "80%",      label: "Desconto máximo registrado" },
  { value: "100%",     label: "Conformidade legal · Decreto 21.981/1932" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ileilao.com/#organization",
        name: "iLeilão",
        url: "https://ileilao.com",
        description: "Plataforma brasileira de leilões online de imóveis, veículos e bens.",
        sameAs: ["https://www.instagram.com/ileilao", "https://www.facebook.com/ileilao"],
      },
      {
        "@type": "WebSite",
        "@id": "https://ileilao.com/#website",
        url: "https://ileilao.com",
        name: "iLeilão",
        publisher: { "@id": "https://ileilao.com/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://ileilao.com/leiloes?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white font-sans">
        <SiteHeader />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-blue-50 to-white pb-10">
          <div className="max-w-7xl mx-auto px-4 pt-10 pb-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse inline-block" />
                  3 leilões acontecendo agora
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug mb-3">
                  A plataforma de{" "}
                  <span className="text-blue-600">leilões online</span>{" "}
                  mais completa do Brasil
                </h1>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Imóveis, veículos, máquinas e muito mais com até <strong className="text-gray-700">80% de desconto</strong>. Leilões judiciais e extrajudiciais em todo o território nacional.
                </p>

                {/* Unified search */}
                <HeroSearch />

                <p className="text-xs text-gray-400 mt-2 text-center">
                  <Link href="/leiloes?status=LIVE" className="text-blue-600 hover:underline font-medium">Leilões ao Vivo</Link>
                  {" "}· Acesse o{" "}
                  <Link href="/ao-vivo" className="text-blue-600 hover:underline font-medium">Auditório Virtual →</Link>
                </p>
              </div>

              <div className="hidden md:block">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl h-80 flex items-center justify-center text-8xl relative overflow-hidden shadow-inner">
                  🏠
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                    3 ao vivo agora
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">🏆</div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Último arremate</p>
                      <p className="text-xs text-gray-500">Apto. em São Paulo — R$ 380.000 <span className="text-green-600 font-semibold">-42%</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Live banner ───────────────────────────────────────────────────── */}
        <div className="bg-blue-600 text-white text-sm py-2.5">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
              Leilões ao vivo agora —
              <Link href="/ao-vivo" className="font-bold underline ml-1">Acessar Auditório Virtual →</Link>
            </span>
            <span className="text-blue-200 text-xs">Segurança jurídica total · Decreto 21.981/1932</span>
          </div>
        </div>

        {/* ── Categorias ───────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Imóveis", icon: "🏠", count: 1240, href: "/leiloes?categoria=IMOVEL", desc: "Residencial, Comercial, Rural" },
              { label: "Veículos", icon: "🚗", count: 873, href: "/leiloes?categoria=VEICULO", desc: "Carros, Motos, Caminhões" },
              { label: "Máquinas & Agro", icon: "🚜", count: 412, href: "/leiloes?categoria=MAQUINA", desc: "Equipamentos, Tratores" },
              { label: "Bens Diversos", icon: "📦", count: 654, href: "/leiloes?categoria=DIVERSOS", desc: "Eletrônicos, Móveis, Arte" },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-300 rounded-2xl p-5 flex items-center gap-4 transition-all group shadow-sm hover:shadow-md">
                <span className="text-3xl flex-shrink-0">{cat.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">{cat.label}</p>
                  <p className="text-xs text-gray-400">{cat.count.toLocaleString("pt-BR")} lotes</p>
                  <p className="text-xs text-gray-400 hidden md:block">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Featured banner ──────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 pb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden gap-4">
            <div className="absolute -right-6 -top-6 text-[160px] opacity-10 select-none">🏠</div>
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Leilão em destaque</p>
              <p className="text-2xl font-black">153 Imóveis · Caixa Econômica Federal</p>
              <p className="text-blue-100 mt-1">Até <span className="text-white font-black text-xl">71% OFF</span> · Parcelamento em até 78 meses</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-blue-200 text-sm mb-2">23 Abr · 10h00</p>
              <Link href="/leiloes/destaque" className="bg-white text-blue-600 font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm inline-block">
                Ver leilão →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Destaques grid ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Oportunidades em destaque</h2>
            <Link href="/leiloes" className="text-sm text-blue-600 font-semibold hover:underline">Ver todos →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED.map((lot) => {
              const discount = lot.discount;
              return (
                <Link key={lot.id} href={`/lote/${lot.id}`}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group">
                  <div className="bg-blue-50 h-44 flex items-center justify-center text-6xl relative">
                    {lot.image}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow">
                      -{discount}%
                    </span>
                    <span className="absolute top-3 right-3 bg-white text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg border border-gray-100">
                      {lot.tag}
                    </span>
                    {lot.badge && (
                      <span className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {lot.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{lot.category}{lot.area ? ` · ${lot.area}` : ""}</p>
                    <p className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">{lot.title}</p>
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">1º Leilão</span>
                        <span className="font-semibold text-gray-700">{lot.date1}</span>
                      </div>
                      {lot.date2 && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">2º Leilão</span>
                          <span className="font-semibold text-gray-500">{lot.date2}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-between border-t border-gray-50 pt-3">
                      <div>
                        <p className="text-xs text-gray-400 line-through">{lot.originalPrice}</p>
                        <p className="text-xl font-black text-blue-600">{lot.price}</p>
                      </div>
                      <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/leiloes" className="inline-block border-2 border-blue-600 text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all">
              Ver todos os leilões →
            </Link>
          </div>
        </section>

        {/* ── Por preço ────────────────────────────────────────────────────── */}
        <section className="bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Encontre o leilão ideal para você</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Por faixa de preço</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map(r => (
                    <Link key={r.href} href={r.href}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all">
                      {r.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Por desconto</h3>
                <div className="grid grid-cols-2 gap-2">
                  {DISCOUNT_RANGES.map(r => (
                    <Link key={r.href} href={r.href}
                      className={`border rounded-xl px-4 py-3 text-sm font-medium transition-all ${r.hot ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50"}`}>
                      {r.hot && "🔥 "}{r.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Por vendedor ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Imóveis por instituição vendedora</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SELLERS.map(s => (
              <Link key={s.name} href={s.href}
                className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group">
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{s.name}</span>
                <span className="text-lg font-black text-blue-600 ml-2 flex-shrink-0">{s.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Como funciona ────────────────────────────────────────────────── */}
        <section className="bg-blue-50 py-14" id="como-funciona">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Como participar de um leilão</h2>
              <p className="text-gray-500 text-sm">Do cadastro ao arremate em 5 passos simples</p>
            </div>
            <div className="grid md:grid-cols-5 gap-4">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={s.step} className="relative">
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-full h-0.5 bg-blue-200 z-0" />
                  )}
                  <div className="relative text-center z-10">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      {s.icon}
                    </div>
                    <p className="text-xs font-bold text-blue-400 mb-1">Passo {s.step}</p>
                    <p className="font-bold text-gray-900 text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/como-funciona" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
                Ver guia completo →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Hub educacional ──────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Entenda o mundo dos leilões</h2>
            <p className="text-gray-500 text-sm">Materiais gratuitos para você investir com segurança</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {EDUCATIONAL.map(e => (
              <Link key={e.title} href={e.href}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="text-3xl mb-3">{e.icon}</div>
                <p className="font-bold text-gray-900 text-sm group-hover:text-blue-700 mb-1">{e.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{e.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <section className="bg-blue-600 py-14 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-black mb-2">{s.value}</p>
                  <p className="text-blue-200 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ───────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vamos encontrar o imóvel ideal?</h2>
            <p className="text-sm text-gray-500 mb-6">Receba as melhores oportunidades de leilão por e-mail antes de todos.</p>
            <NewsletterForm />
            <p className="text-xs text-gray-400 mt-3">
              Ao se cadastrar, você concorda com nossa{" "}
              <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link>
            </p>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="bg-gray-900 text-gray-400 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-5 gap-8 mb-10">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-0.5 mb-4">
                  <span className="text-xl font-black text-blue-400">i</span>
                  <span className="text-xl font-black text-white">Leilão</span>
                </div>
                <p className="text-sm leading-relaxed mb-4">A plataforma de leilões online mais completa do Brasil. Imóveis, veículos e bens com total transparência e segurança jurídica.</p>
                <div className="space-y-1 text-xs">
                  <p>📍 São Paulo/SP · Brasília/DF</p>
                  <p>📧 contato@ileilao.com</p>
                  <p>💬 WhatsApp: (11) 99514-0000</p>
                </div>
              </div>

              {/* Leilões */}
              <div>
                <p className="font-bold text-white mb-3 text-sm">Leilões</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Imóveis Residenciais", "/leiloes?categoria=IMOVEL&tipo=residencial"],
                    ["Imóveis Comerciais", "/leiloes?categoria=IMOVEL&tipo=comercial"],
                    ["Imóveis Rurais", "/leiloes?categoria=IMOVEL&tipo=rural"],
                    ["Terrenos", "/leiloes?categoria=IMOVEL&tipo=terreno"],
                    ["Veículos", "/leiloes?categoria=VEICULO"],
                    ["Máquinas & Agro", "/leiloes?categoria=MAQUINA"],
                    ["Bens Diversos", "/leiloes?categoria=DIVERSOS"],
                    ["Leilões ao Vivo", "/leiloes?status=LIVE"],
                    ["Próximos Leilões", "/leiloes?status=UPCOMING"],
                    ["Leilões Judiciais", "/leiloes?tipo=judicial"],
                    ["Leilões Encerrados", "/leiloes?status=ENDED"],
                  ].map(([label, href]) => (
                    <p key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></p>
                  ))}
                </div>
              </div>

              {/* Por estado (SEO) */}
              <div>
                <p className="font-bold text-white mb-3 text-sm">Por Estado</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Leilões em São Paulo", "/leiloes?uf=SP"],
                    ["Leilões no Rio de Janeiro", "/leiloes?uf=RJ"],
                    ["Leilões em Minas Gerais", "/leiloes?uf=MG"],
                    ["Leilões no Paraná", "/leiloes?uf=PR"],
                    ["Leilões no RS", "/leiloes?uf=RS"],
                    ["Leilões em SC", "/leiloes?uf=SC"],
                    ["Leilões na Bahia", "/leiloes?uf=BA"],
                    ["Leilões em GO", "/leiloes?uf=GO"],
                    ["Leilões no DF", "/leiloes?uf=DF"],
                    ["Leilões em CE", "/leiloes?uf=CE"],
                    ["Leilões em PE", "/leiloes?uf=PE"],
                  ].map(([label, href]) => (
                    <p key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></p>
                  ))}
                </div>
              </div>

              {/* Empresa + Legal */}
              <div>
                <p className="font-bold text-white mb-3 text-sm">Empresa</p>
                <div className="space-y-2 text-sm mb-6">
                  {[["Sobre nós", "/sobre"], ["Para leiloeiros", "/leiloeiros"], ["Blog", "/blog"], ["Fale Conosco", "/contato"], ["Na Mídia", "/midia"]].map(([label, href]) => (
                    <p key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></p>
                  ))}
                </div>
                <p className="font-bold text-white mb-3 text-sm">Legal</p>
                <div className="space-y-2 text-sm">
                  {[["Termos de Uso", "/termos"], ["Privacidade", "/privacidade"], ["Código de Ética", "/etica"], ["Glossário", "/glossario"]].map(([label, href]) => (
                    <p key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></p>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                A iLeilão não oferece serviços financeiros. As formas de pagamento nos leilões são operações oferecidas diretamente do comitente vendedor ao arrematante do leilão.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <p>© 2026 iLeilão. Todos os direitos reservados.</p>
                <p className="text-gray-600">Decreto 21.981/1932 · Novo CPC Art. 879 · LGPD</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
