import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Alienação Fiduciária — Imóveis Retomados de Bancos em Leilão | iLeilão",
  description: "Compre imóveis em leilão de alienação fiduciária com até 70% de desconto. Entenda como funciona a lei 9.514/97 e como arrematar com segurança.",
  keywords: ["alienação fiduciária", "leilão alienação fiduciária", "lei 9514", "imóvel retomado banco", "leilão extrajudicial"],
  alternates: { canonical: "https://ileilao.com/leiloes/alienacao-fiduciaria" },
};

const FAQ = [
  { q: "O que é alienação fiduciária de imóvel?", a: "É uma forma de garantia em contratos de financiamento imobiliário pela Lei 9.514/97. O comprador financia o imóvel, mas a propriedade fica no nome do banco até a quitação total. Se o devedor não pagar, o banco pode retomar e leiloar o imóvel sem necessidade de ação judicial." },
  { q: "Quais bancos realizam leilões de alienação fiduciária?", a: "Todos os grandes bancos brasileiros: Caixa Econômica Federal, Itaú, Bradesco, Santander, Banco do Brasil, Banco Inter, entre outros. A Caixa é o maior vendedor, com centenas de imóveis leiloados mensalmente em todo o Brasil." },
  { q: "O imóvel vem com dívidas?", a: "Na alienação fiduciária, o banco consolida a propriedade antes do leilão e geralmente quita IPTU e condomínio atrasados. O arrematante recebe o imóvel livre desses débitos. Porém, sempre verifique o edital específico de cada lote." },
  { q: "Pode ter recurso do devedor?", a: "Diferente do leilão judicial, o processo de alienação fiduciária é extrajudicial e tem poucos mecanismos de contestação. O devedor pode tentar ação judicial, mas isso raramente impede o leilão. A Lei 9.514/97 foi desenhada para dar segurança jurídica ao credor." },
  { q: "Posso visitar o imóvel antes de dar o lance?", a: "Depende. Imóveis desocupados costumam permitir visita agendada. Imóveis ocupados geralmente não permitem visita prévia — o banco não tem livre acesso ao imóvel até a consolidação." },
];

export default function AlienacaoFiduciariaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[
        { label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" },
        { label: "Extrajudiciais", href: "/leiloes/extrajudiciais" }, { label: "Alienação Fiduciária" },
      ]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Imóveis em Leilão de Alienação Fiduciária</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Imóveis retomados por bancos via lei 9.514/97 — processo ágil, documentação limpa e descontos de até <strong className="text-gray-700">70%</strong>.
          </p>
          <Link href="/leiloes?categoria=IMOVEL&tipo=extrajudicial"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver imóveis de alienação fiduciária →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">O que é alienação fiduciária?</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 prose prose-sm text-gray-600 max-w-none">
          <p>A <strong>alienação fiduciária</strong> é uma modalidade de garantia em contratos de financiamento imobiliário, regulamentada pela <strong>Lei 9.514/97</strong>. Quando você financia um imóvel via alienação fiduciária, o bem fica registrado no nome do banco (credor fiduciário) até você quitar todo o financiamento.</p>
          <p className="mt-3">Se você (devedor fiduciante) parar de pagar, o banco pode <strong>consolidar a propriedade</strong> do imóvel e realizar um leilão extrajudicial para recuperar o crédito. Esse processo é muito mais rápido do que a execução hipotecária antiga — normalmente leva de 2 a 6 meses.</p>
          <h3 className="font-bold text-gray-800 mt-4">Por que é boa oportunidade para compradores?</h3>
          <ul className="space-y-1">
            <li>Bancos precisam vender rapidamente — criam descontos reais</li>
            <li>Documentação geralmente limpa (banco quita IPTU/condomínio)</li>
            <li>Menos risco de anulação judicial que leilões por execução hipotecária</li>
            <li>Possibilidade de financiamento (especialmente na Caixa)</li>
          </ul>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Principais vendedores</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { slug: "caixa", nome: "Caixa Econômica Federal" },
            { slug: "itau", nome: "Itaú Unibanco" },
            { slug: "bradesco", nome: "Bradesco" },
            { slug: "santander", nome: "Santander" },
            { slug: "bb", nome: "Banco do Brasil" },
            { slug: "inter", nome: "Banco Inter" },
          ].map(b => (
            <Link key={b.slug} href={`/leiloes/banco/${b.slug}`}
              className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition">
              <div className="text-sm font-medium text-gray-800">{b.nome}</div>
              <div className="text-xs text-blue-600 mt-1">Ver leilões →</div>
            </Link>
          ))}
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas sobre alienação fiduciária" />
    </div>
  );
}
