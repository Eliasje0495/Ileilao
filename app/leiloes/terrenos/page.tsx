import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terrenos em Leilão — Lotes Urbanos e Rurais com Desconto | iLeilão",
  description: "Encontre terrenos e lotes em leilão em todo o Brasil com até 70% de desconto. Terrenos urbanos, lotes rurais e chácaras — leilões judiciais e extrajudiciais.",
  keywords: ["terreno leilão", "lote leilão", "terreno barato", "leilão terreno judicial", "comprar terreno leilão"],
  alternates: { canonical: "https://ileilao.com/leiloes/terrenos" },
};

const FAQ = [
  { q: "Terreno de leilão tem documentação regularizada?", a: "Depende do lote. Verifique na matrícula do cartório se há dívidas, usufruto, hipoteca ou outros ônus. Em leilões extrajudiciais de bancos, a documentação tende a estar mais limpa. Sempre leia o edital completo antes de dar o lance." },
  { q: "Posso construir imediatamente em terreno de leilão?", a: "Após a arrematação e registro do imóvel em seu nome, você pode construir seguindo as regras de zoneamento e uso do solo da prefeitura local. Obtenha a certidão de matrícula atualizada antes de iniciar qualquer obra." },
  { q: "Terreno rural em leilão tem INCRA?", a: "Terrenos rurais podem ter restrições do INCRA (Instituto Nacional de Colonização e Reforma Agrária). Verifique se o imóvel está dentro de área de assentamento, indígena ou de proteção ambiental. Essas informações devem constar no edital." },
  { q: "Como calcular o valor real de um terreno em leilão?", a: "Compare com valores de mercado na região usando sites de imóveis. Calcule custos adicionais: ITBI (3-4% sobre o valor), cartório (0,5-1%), e eventuais dívidas de IPTU. O desconto aparente pode ser menor após incluir todos os custos." },
];

export default function LeiloesTerrenosPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Terrenos" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Terrenos e Lotes em Leilão</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Terrenos urbanos, lotes e chácaras em leilão em todo o Brasil com até <strong className="text-gray-700">70% de desconto</strong>. Judiciais e extrajudiciais.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: "Urbanos", href: "/leiloes?categoria=IMOVEL&tipo=terreno&subtipo=urbano" },
              { label: "Rurais", href: "/leiloes?categoria=IMOVEL&tipo=terreno&subtipo=rural" },
              { label: "Lotes em condomínio", href: "/leiloes?categoria=IMOVEL&tipo=terreno&subtipo=condominio" },
              { label: "Chácaras", href: "/leiloes?categoria=IMOVEL&tipo=terreno&subtipo=chacara" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/leiloes?categoria=IMOVEL&tipo=terreno"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver todos os terrenos em leilão →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Terrenos em leilão por estado</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(ESTADOS_MAP).map(([slug, { nome, uf }]) => (
            <Link key={slug} href={`/leiloes/imoveis/${slug}`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50 transition group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{uf}</span>
              <span className="text-xs text-gray-400">{nome.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas sobre terrenos em leilão" />
    </div>
  );
}
