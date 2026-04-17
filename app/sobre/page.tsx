import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Sobre a iLeilão — Plataforma de Leilões Online no Brasil",
  description: "Conheça a iLeilão, a plataforma de leilões online mais completa do Brasil. Nossa missão, valores e como estamos transformando o mercado de leilões.",
  alternates: { canonical: "https://ileilao.com/sobre" },
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Democratizando o acesso a leilões no Brasil
          </h1>
          <p className="text-blue-200 text-base max-w-2xl mx-auto">
            A iLeilão reúne os melhores leilões de imóveis, veículos e equipamentos em uma plataforma 100% digital, transparente e acessível para todos.
          </p>
        </div>
      </section>

      {/* Missão */}
      <section className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        {[
          { icon: "🎯", title: "Missão", desc: "Tornar os leilões acessíveis a qualquer brasileiro, com tecnologia, transparência e educação financeira." },
          { icon: "👁️", title: "Visão", desc: "Ser a maior plataforma de leilões online do Brasil, referência em confiança e oportunidades reais." },
          { icon: "💎", title: "Valores", desc: "Transparência, segurança jurídica, inovação e foco total na experiência do comprador." },
        ].map(item => (
          <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="font-bold text-gray-900 mb-2">{item.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* História */}
      <section className="bg-white border-t border-b border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Nossa história</h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-4">
            <p>A iLeilão nasceu da frustração de compradores que tentavam participar de leilões e se deparavam com editais difíceis de entender, plataformas desatualizadas e processos burocráticos sem transparência.</p>
            <p>Fundada em São Paulo, a iLeilão desenvolveu uma plataforma que centraliza leilões de imóveis, veículos e máquinas de todo o Brasil, com ferramentas de análise, alertas personalizados e suporte dedicado.</p>
            <p>Hoje, conectamos milhares de compradores a leiloeiros oficiais credenciados pela Junta Comercial, com total segurança jurídica e processo 100% digital.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "12.000+", label: "lotes publicados" },
            { num: "47.000+", label: "compradores cadastrados" },
            { num: "27", label: "estados atendidos" },
            { num: "R$ 2,3 bi", label: "em arrematações" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-blue-700">{s.num}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Pronto para começar?</h2>
          <p className="text-blue-100 text-sm mb-5">Cadastre-se grátis e explore centenas de oportunidades.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/auth/register" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
              Criar conta grátis
            </Link>
            <Link href="/contato" className="border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
