import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Leilão Judicial de Imóveis — Hastas Públicas em Todo o Brasil | iLeilão",
  description: "Encontre imóveis em leilão judicial (hasta pública) em todo o Brasil com até 80% de desconto. Apartamentos, casas e terrenos de execuções judiciais — 1ª e 2ª praça.",
  keywords: ["leilão judicial", "hasta pública", "leilão judicial imóvel", "1ª praça", "2ª praça", "execução judicial"],
  alternates: { canonical: "https://ileilao.com/leiloes/judiciais" },
};

const FAQ = [
  { q: "O que é um leilão judicial?", a: "O leilão judicial (hasta pública) é determinado por um juiz para saldar dívidas reconhecidas em processo judicial. O bem é vendido pelo maior lance, sendo o comprador o 'arrematante'. Regulamentado pelos artigos 879 a 903 do Código de Processo Civil." },
  { q: "O que é 1ª e 2ª praça no leilão judicial?", a: "Na 1ª praça, o lance mínimo é igual ao valor de avaliação do bem. Se não houver compradores, realiza-se a 2ª praça com valor mínimo reduzido (podendo chegar a 50% da avaliação), ampliando as oportunidades de compra." },
  { q: "Leilão judicial tem riscos maiores?", a: "Pode haver recursos judiciais que atrasam a entrega do bem. Imóveis podem estar ocupados (desocupação é responsabilidade do arrematante). Dívidas de IPTU e condomínio podem ser transferidas ao comprador — verifique sempre o edital." },
  { q: "O que é carta de arrematação?", a: "A carta de arrematação é o documento emitido pelo juiz após o pagamento que comprova a aquisição do bem. Com ela, o arrematante pode registrar o imóvel no Cartório de Registro de Imóveis em seu nome." },
  { q: "Como encontrar leilões judiciais?", a: "Leilões judiciais são publicados nos Diários Oficiais e em sites de tribunais. A iLeilão agrega leilões judiciais de todo o Brasil em um só lugar, com filtros por estado, tipo de bem e data." },
];

export default function LeiloesJudiciaisPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Judiciais" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-xs font-medium text-blue-700 mb-3">
            ⚖️ Hasta Pública
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leilão Judicial de Imóveis</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Hastas públicas determinadas por juízes — apartamentos, casas, terrenos e imóveis comerciais com até <strong className="text-gray-700">80% de desconto</strong>. 1ª e 2ª praça em todo o Brasil.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {["1ª Praça", "2ª Praça", "Apartamentos", "Casas", "Terrenos", "Comerciais"].map(tipo => (
              <Link key={tipo} href={`/leiloes?categoria=IMOVEL&tipo=judicial`}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
                {tipo}
              </Link>
            ))}
          </div>
          <Link href="/leiloes?categoria=IMOVEL&tipo=judicial"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver leilões judiciais →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Como funciona a hasta pública</h2>
          <div className="space-y-3">
            {[
              { step: "1", title: "Penhora judicial", desc: "Um juiz determina a penhora do bem para saldar dívida reconhecida em processo judicial." },
              { step: "2", title: "Avaliação pericial", desc: "Perito judicial avalia o imóvel e define o valor de referência para os lances." },
              { step: "3", title: "Publicação do edital", desc: "O leiloeiro oficial publica o edital no Diário Oficial e em plataformas como a iLeilão." },
              { step: "4", title: "1ª Praça", desc: "Lances a partir do valor de avaliação. Se não houver comprador, segue para 2ª Praça." },
              { step: "5", title: "2ª Praça", desc: "Lances com valor mínimo reduzido (até 50% da avaliação) — maior oportunidade de desconto." },
              { step: "6", title: "Carta de arrematação", desc: "Após pagamento, o juiz emite a carta de arrematação para registro em cartório." },
            ].map(item => (
              <div key={item.step} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Leilões judiciais por estado</h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ESTADOS_MAP).map(([slug, e]) => (
              <Link key={slug} href={`/leiloes/imoveis/${slug}`}
                className="text-center py-2 px-1 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 transition bg-white">
                {e.uf}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 prose prose-sm text-gray-600 max-w-none">
          <h2 className="text-xl font-bold text-gray-900">Leilão Judicial de Imóveis — iLeilão</h2>
          <p>O leilão judicial, também chamado de hasta pública, é a modalidade em que um juiz determina a venda pública de bens penhorados para saldar dívidas reconhecidas em processo judicial. A iLeilão reúne as melhores oportunidades de leilões judiciais de imóveis em todo o Brasil.</p>
          <h3 className="font-bold text-gray-800 mt-4">Diferença entre 1ª e 2ª Praça</h3>
          <ul className="space-y-1">
            <li><strong>1ª Praça:</strong> lance mínimo igual ao valor de avaliação do bem — menor desconto, maior segurança</li>
            <li><strong>2ª Praça:</strong> valor mínimo reduzido (pode chegar a 50% da avaliação) — maior oportunidade de desconto</li>
            <li><strong>Pagamento:</strong> geralmente dentro de 24-48h após o arremate, podendo haver parcelamento</li>
            <li><strong>Documentação:</strong> carta de arrematação emitida pelo juiz, registrada em cartório</li>
          </ul>
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas frequentes sobre leilão judicial" />
    </div>
  );
}
