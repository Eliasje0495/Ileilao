import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Leilão de Veículos Online — Carros, Motos e Caminhões | iLeilão",
  description: "Encontre carros, motos, caminhões e utilitários em leilão online com até 70% de desconto. Leilões de veículos de bancos, seguradoras e órgãos públicos em todo o Brasil.",
  keywords: ["leilão de veículos", "leilão de carros", "leilão de motos", "leilão detran", "carro leilão"],
  alternates: { canonical: "https://ileilao.com/leiloes/veiculos" },
};

const FAQ = [
  { q: "Como funciona o leilão de veículos?", a: "O processo é similar ao de imóveis: cadastro, KYC, leitura do edital, depósito de caução e lance. Veículos de leilão vêm de bancos (retomados de financiamento), seguradoras (sinistros) ou órgãos públicos (frota)." },
  { q: "Veículo de leilão tem documentação regularizada?", a: "Depende. Veículos de bancos geralmente têm documentação em ordem. Veículos de seguradora (sinistro) podem ter restrição. Sempre verifique o edital e consulte o DETRAN antes de dar o lance." },
  { q: "Posso vistoriar o veículo antes do leilão?", a: "Em muitos leilões é possível agendar visita para inspecionar o veículo. Consulte o edital para verificar data, horário e local de visitação." },
  { q: "Quais são os custos além do lance?", a: "Comissão do leiloeiro (geralmente 5%), IPVA atrasado (verifique no edital), e custos de transferência de propriedade no DETRAN." },
];

export default function LeiloesVeiculosPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Veículos" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leilão de Veículos Online</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Carros, motos, caminhões e utilitários em leilão com até <strong className="text-gray-700">70% de desconto</strong>. Veículos de bancos, seguradoras e órgãos públicos em todo o Brasil.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {["Carros", "Motos", "Caminhões", "Utilitários", "Ônibus"].map(tipo => (
              <Link key={tipo} href={`/leiloes?categoria=VEICULO&tipo=${tipo.toLowerCase()}`}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
                {tipo}
              </Link>
            ))}
          </div>
          <Link href="/leiloes?categoria=VEICULO"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver todos os veículos em leilão →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Leilão de veículos por estado</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(ESTADOS_MAP).map(([slug, { nome, uf }]) => (
            <Link key={slug} href={`/leiloes/veiculos/${slug}`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50 transition group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{uf}</span>
              <span className="text-xs text-gray-400">{nome.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas frequentes sobre leilão de veículos" />
    </div>
  );
}
