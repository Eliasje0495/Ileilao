import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "iLeilão na Mídia — Imprensa e Comunicação",
  description: "Assessoria de imprensa da iLeilão. Releases, contatos para jornalistas e informações sobre a plataforma.",
};

const PRESS_ITEMS = [
  {
    outlet: "Estadão",
    date: "Março 2025",
    title: "iLeilão digitaliza o mercado de leilões judiciais no Brasil",
    excerpt: "Startup brasileira lança plataforma que permite participar de leilões de imóveis e veículos 100% online, com KYC automático e transmissão ao vivo.",
    href: "#",
  },
  {
    outlet: "Valor Econômico",
    date: "Fevereiro 2025",
    title: "Leilões online crescem 40% em 2024; iLeilão lidera segmento",
    excerpt: "Plataforma atinge marca de 50 mil usuários cadastrados e R$ 2 bilhões em ativos leiloados no primeiro ano de operação.",
    href: "#",
  },
  {
    outlet: "Exame",
    date: "Janeiro 2025",
    title: "Como comprar imóveis com 60% de desconto em leilões online",
    excerpt: "Reportagem especial mostra como a iLeilão está democratizando o acesso a imóveis de alto padrão por meio de leilões extrajudiciais.",
    href: "#",
  },
];

export default function MidiaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />

      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Imprensa</p>
          <h1 className="text-3xl font-black text-gray-900 mb-4">iLeilão na Mídia</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Para entrevistas, releases ou informações à imprensa, entre em contato com nossa equipe de comunicação.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:imprensa@ileilao.com"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
              imprensa@ileilao.com
            </a>
            <Link href="/contato"
              className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-blue-400 hover:text-blue-700 transition">
              Formulário de contato
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Últimas aparições</h2>
        <div className="space-y-4">
          {PRESS_ITEMS.map((item) => (
            <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{item.outlet}</span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.excerpt}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Kit de imprensa</h2>
          <p className="text-sm text-gray-600 mb-4">
            Baixe nosso kit com logos, screenshots, dados de mercado e informações sobre a empresa.
          </p>
          <a href="mailto:imprensa@ileilao.com?subject=Kit%20de%20Imprensa"
            className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">
            Solicitar kit por e-mail
          </a>
        </div>
      </section>
    </div>
  );
}
