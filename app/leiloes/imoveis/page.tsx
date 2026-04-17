import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Leilão de Imóveis Online — Judiciais e Extrajudiciais | iLeilão",
  description: "Encontre imóveis em leilão em todo o Brasil com até 80% de desconto. Apartamentos, casas, terrenos e comerciais — leilões judiciais e extrajudiciais. Cadastre-se grátis.",
  keywords: ["leilão de imóveis", "leilão imóvel online", "leilão judicial imóvel", "leilão extrajudicial", "imóvel leilão"],
  alternates: { canonical: "https://ileilao.com/leiloes/imoveis" },
  openGraph: { title: "Leilão de Imóveis Online | iLeilão", description: "Até 80% de desconto em imóveis de leilão em todo o Brasil." },
};

const FAQ = [
  { q: "Como participar de um leilão de imóveis?", a: "Para participar você precisa se cadastrar na iLeilão, fazer a verificação de identidade (KYC), ler o edital do imóvel de interesse, depositar a caução e dar seu lance na data marcada." },
  { q: "Imóvel de leilão tem dívida?", a: "Depende do edital. Em leilões extrajudiciais (alienação fiduciária), geralmente o arrematante recebe o imóvel livre de débitos. Em leilões judiciais, é possível que IPTU e condomínio sejam transferidos — sempre verifique o edital e a matrícula." },
  { q: "Posso financiar um imóvel de leilão?", a: "Sim, em alguns casos é possível financiar imóvel de leilão extrajudicial com bancos como Caixa e Bradesco. Porém, nem todos os lotes aceitam financiamento — consulte o edital." },
  { q: "Qual é o desconto médio em leilões de imóveis?", a: "O desconto varia entre 20% e 80% do valor de avaliação. A média gira em torno de 30-40%, com imóveis ocupados ou com débitos apresentando descontos maiores." },
  { q: "O que é 1ª e 2ª praça?", a: "No leilão judicial, a 1ª praça tem o valor mínimo igual à avaliação. Se não houver comprador, realiza-se a 2ª praça com valor reduzido (podendo chegar a 50% da avaliação). Em leilões extrajudiciais, os termos podem ser diferentes — veja o edital." },
];

export default function LeiloesImoveisPage() {
  const estados = Object.entries(ESTADOS_MAP);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Imóveis" }]} />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leilão de Imóveis Online</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Imóveis residenciais, comerciais, rurais e terrenos em leilão em todo o Brasil com até <strong className="text-gray-700">80% de desconto</strong>. Leilões judiciais e extrajudiciais disponíveis.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Residenciais",  href: "/leiloes?categoria=IMOVEL&tipo=residencial" },
              { label: "Comerciais",    href: "/leiloes?categoria=IMOVEL&tipo=comercial" },
              { label: "Rurais",        href: "/leiloes?categoria=IMOVEL&tipo=rural" },
              { label: "Terrenos",      href: "/leiloes/terrenos" },
              { label: "Judiciais",     href: "/leiloes/judiciais" },
              { label: "Extrajudiciais",href: "/leiloes/extrajudiciais" },
              { label: "Ao Vivo",       href: "/leiloes?status=LIVE" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to main listing */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/leiloes?categoria=IMOVEL"
          className="block w-full md:w-auto md:inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition text-center text-lg">
          Ver todos os imóveis em leilão →
        </Link>
      </div>

      {/* By state */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Leilão de imóveis por estado</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {estados.map(([slug, { nome, uf }]) => (
            <Link key={slug} href={`/leiloes/imoveis/${slug}`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50 transition group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{uf}</span>
              <span className="text-xs text-gray-400">{nome.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO content */}
      <section className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 prose prose-sm text-gray-600 max-w-none">
          <h2 className="text-xl font-bold text-gray-900">Leilão de Imóveis Online — iLeilão</h2>
          <p>A iLeilão é a plataforma de leilões online mais completa do Brasil para quem quer comprar imóveis com <strong>desconto de até 80%</strong>. Reunimos em um só lugar leilões de imóveis judiciais e extrajudiciais de todos os estados — de apartamentos em São Paulo a fazendas no Mato Grosso.</p>
          <h3 className="font-bold text-gray-800 mt-4">Por que comprar imóvel em leilão?</h3>
          <ul className="space-y-1">
            <li><strong>Economia:</strong> preços muito abaixo do mercado, com descontos reais de 20% a 80%</li>
            <li><strong>Transparência:</strong> processo regulamentado pelo Decreto 21.981/1932 e Código de Processo Civil</li>
            <li><strong>Variedade:</strong> apartamentos, casas, terrenos, galpões e imóveis rurais em todos os estados</li>
            <li><strong>Segurança jurídica:</strong> leiloeiros oficiais credenciados pela Junta Comercial (JUCESP)</li>
          </ul>
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas frequentes sobre leilão de imóveis" />
    </div>
  );
}
