import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Leilão Extrajudicial — Alienação Fiduciária e Imóveis de Bancos | iLeilão",
  description: "Imóveis em leilão extrajudicial (alienação fiduciária) de bancos como Itaú, Bradesco, Caixa e Santander com até 70% de desconto. Processo mais rápido e seguro que leilão judicial.",
  keywords: ["leilão extrajudicial", "alienação fiduciária", "leilão banco", "leilão caixa", "leilão bradesco", "imóvel retomado"],
  alternates: { canonical: "https://ileilao.com/leiloes/extrajudiciais" },
};

const FAQ = [
  { q: "O que é leilão extrajudicial?", a: "O leilão extrajudicial ocorre fora do judiciário, quando um banco retoma um imóvel financiado após inadimplência do devedor. A modalidade mais comum é a alienação fiduciária, regulamentada pela Lei 9.514/97. É mais rápido e menos sujeito a recursos do que o leilão judicial." },
  { q: "O imóvel de leilão extrajudicial vem com dívidas?", a: "Em leilões extrajudiciais de alienação fiduciária, o arrematante geralmente recebe o imóvel livre de débitos de IPTU e condomínio — o banco quita essas dívidas. Sempre confirme lendo o edital completo." },
  { q: "Posso financiar um imóvel de leilão extrajudicial?", a: "Em alguns casos sim, especialmente em leilões da Caixa Econômica Federal que aceitam financiamento FGTS. Porém, nem todos os lotes aceitam financiamento — consulte o edital do lote específico." },
  { q: "Qual a diferença entre leilão extrajudicial e judicial?", a: "O leilão extrajudicial é realizado pelo banco sem intervenção judicial, o processo é mais rápido (30-60 dias após consolidação da propriedade) e a documentação tende a ser mais limpa. O leilão judicial depende de decisão judicial e pode demorar mais." },
  { q: "O que significa 'consolidação da propriedade'?", a: "Quando o devedor fica inadimplente no financiamento por alienação fiduciária, o banco notifica o devedor (prazo de 15 dias para purgar a mora). Se o devedor não pagar, o banco consolida a propriedade do imóvel e pode realizar o leilão extrajudicial." },
];

export default function LeiloesExtrajudiciaisPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Extrajudiciais" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-3 py-1 text-xs font-medium text-green-700 mb-3">
            🏦 Imóveis de Bancos
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leilão Extrajudicial de Imóveis</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Imóveis retomados por bancos via alienação fiduciária — processo mais rápido e seguro. Até <strong className="text-gray-700">70% de desconto</strong> em apartamentos, casas e terrenos.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {["Caixa", "Itaú", "Bradesco", "Santander", "Banco do Brasil"].map(banco => (
              <Link key={banco} href={`/leiloes/banco/${banco.toLowerCase().replace(" ", "-")}`}
                className="px-4 py-2 bg-green-50 border border-green-100 rounded-full text-sm font-medium text-green-700 hover:bg-green-600 hover:text-white transition-all">
                {banco}
              </Link>
            ))}
          </div>
          <Link href="/leiloes?categoria=IMOVEL&tipo=extrajudicial"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver leilões extrajudiciais →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Como funciona a alienação fiduciária</h2>
          <div className="space-y-3">
            {[
              { step: "1", title: "Financiamento bancário", desc: "Comprador financia o imóvel pelo banco. O bem fica como garantia (alienação fiduciária) até a quitação total." },
              { step: "2", title: "Inadimplência", desc: "O devedor para de pagar as parcelas do financiamento." },
              { step: "3", title: "Notificação", desc: "O banco notifica o devedor via cartório, dando 15 dias para pagar a dívida e recuperar o imóvel." },
              { step: "4", title: "Consolidação", desc: "Se o devedor não pagar, o banco consolida a propriedade do imóvel no seu nome." },
              { step: "5", title: "Leilão extrajudicial", desc: "O banco realiza leilão público em até 30 dias. 1º leilão pelo valor da dívida, 2º com valor mínimo reduzido." },
              { step: "6", title: "Arrematação", desc: "Vencedor paga e recebe escritura pública. O imóvel é transferido livre de débitos (verifique o edital)." },
            ].map(item => (
              <div key={item.step} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Por estado</h2>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.entries(ESTADOS_MAP).slice(0, 18).map(([slug, e]) => (
              <Link key={slug} href={`/leiloes/imoveis/${slug}`}
                className="text-center py-2 px-1 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 transition bg-white">
                {e.uf}
              </Link>
            ))}
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-green-900 mb-2">Vantagens do leilão extrajudicial</h3>
            <ul className="space-y-1.5">
              {[
                "Processo mais rápido (30-60 dias)",
                "Menos sujeito a recursos e impugnações",
                "Documentação geralmente mais limpa",
                "Imóvel frequentemente desocupado",
                "Possibilidade de financiamento (Caixa)",
              ].map(v => (
                <li key={v} className="flex items-start gap-2 text-xs text-green-800">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas frequentes sobre leilão extrajudicial" />
    </div>
  );
}
