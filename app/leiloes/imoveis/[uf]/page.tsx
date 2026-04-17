import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

interface Props { params: Promise<{ uf: string }> }

export async function generateStaticParams() {
  return Object.keys(ESTADOS_MAP).map(uf => ({ uf }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf } = await params;
  const estado = ESTADOS_MAP[uf.toLowerCase()];
  if (!estado) return { title: "Leilão de Imóveis | iLeilão" };
  return {
    title: `Leilão de Imóveis ${estado.prep.charAt(0).toUpperCase() + estado.prep.slice(1)} ${estado.nome} — Judiciais e Extrajudiciais | iLeilão`,
    description: `Encontre imóveis em leilão ${estado.prep} ${estado.nome} (${estado.uf}) com até 80% de desconto. Apartamentos, casas, terrenos e imóveis comerciais — leilões judiciais e extrajudiciais.`,
    alternates: { canonical: `https://ileilao.com/leiloes/imoveis/${uf.toLowerCase()}` },
    openGraph: {
      title: `Leilão de Imóveis ${estado.prep} ${estado.nome} | iLeilão`,
      description: `Até 80% de desconto em imóveis de leilão ${estado.prep} ${estado.nome}.`,
    },
  };
}

export default async function LeiloesImoveisUfPage({ params }: Props) {
  const { uf } = await params;
  const estado = ESTADOS_MAP[uf.toLowerCase()];
  if (!estado) notFound();

  const prep = estado.prep.charAt(0).toUpperCase() + estado.prep.slice(1);

  const FAQ = [
    { q: `Como participar de leilão de imóveis ${estado.prep} ${estado.nome}?`, a: `Para participar de leilões de imóveis ${estado.prep} ${estado.nome}, cadastre-se gratuitamente na iLeilão, faça sua verificação de identidade, encontre imóveis ${estado.prep} ${estado.nome} e dê seu lance online.` },
    { q: `Imóveis em leilão ${estado.prep} ${estado.nome} têm dívidas?`, a: "Depende do edital. Em leilões extrajudiciais (alienação fiduciária), o arrematante geralmente recebe o imóvel livre de débitos. Em leilões judiciais, verifique sempre o edital e a certidão de matrícula." },
    { q: "Qual é o desconto médio nos leilões?", a: `Os descontos em leilões de imóveis ${estado.prep} ${estado.nome} variam entre 20% e 80% do valor de avaliação. Imóveis ocupados ou com irregularidades tendem a apresentar descontos maiores.` },
    { q: "Posso visitar o imóvel antes de dar o lance?", a: "Em alguns casos sim — verifique o edital. Imóveis desocupados costumam permitir visita agendada. Imóveis ocupados geralmente não permitem visita prévia." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Leilões", href: "/leiloes" },
        { label: "Imóveis", href: "/leiloes/imoveis" },
        { label: estado.nome },
      ]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Leilão de Imóveis {prep} {estado.nome}
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Imóveis residenciais, comerciais, rurais e terrenos em leilão {estado.prep} {estado.nome} com até <strong className="text-gray-700">80% de desconto</strong>. Leilões judiciais e extrajudiciais.
          </p>
          <Link href={`/leiloes?categoria=IMOVEL&uf=${estado.uf}`}
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver imóveis em leilão {estado.prep} {estado.nome} →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tipos de leilão {estado.prep} {estado.nome}</h2>
          <div className="space-y-2">
            {[
              { label: `Leilão judicial ${estado.prep} ${estado.nome}`,        href: `/leiloes?categoria=IMOVEL&uf=${estado.uf}&tipo=judicial` },
              { label: `Leilão extrajudicial ${estado.prep} ${estado.nome}`,   href: `/leiloes?categoria=IMOVEL&uf=${estado.uf}&tipo=extrajudicial` },
              { label: `Apartamentos em leilão ${estado.prep} ${estado.nome}`, href: `/leiloes?categoria=IMOVEL&uf=${estado.uf}&tipo=residencial` },
              { label: `Terrenos em leilão ${estado.prep} ${estado.nome}`,     href: `/leiloes?categoria=IMOVEL&uf=${estado.uf}&tipo=terreno` },
              { label: `Imóveis comerciais ${estado.prep} ${estado.nome}`,     href: `/leiloes?categoria=IMOVEL&uf=${estado.uf}&tipo=comercial` },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{item.label}</span>
                <span className="text-blue-400">→</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">Outros estados</h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ESTADOS_MAP).filter(([s]) => s !== uf.toLowerCase()).slice(0, 12).map(([slug, e]) => (
              <Link key={slug} href={`/leiloes/imoveis/${slug}`}
                className="text-center py-2 px-1 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 transition">
                {e.uf}
              </Link>
            ))}
          </div>
          <Link href="/leiloes/imoveis" className="text-xs text-blue-600 hover:underline mt-3 inline-block">Ver todos os estados →</Link>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 prose prose-sm text-gray-600 max-w-none">
          <h2 className="text-lg font-bold text-gray-900">Leilão de Imóveis {prep} {estado.nome} ({estado.uf})</h2>
          <p>A iLeilão reúne os melhores leilões de imóveis {estado.prep} {estado.nome}, incluindo apartamentos, casas, terrenos, imóveis comerciais e rurais disponíveis por meio de leilões judiciais e extrajudiciais. Os descontos chegam a 80% do valor de avaliação, oferecendo oportunidades únicas para compradores e investidores.</p>
          <p className="mt-2">Para participar dos leilões de imóveis {estado.prep} {estado.nome}, cadastre-se gratuitamente na iLeilão, complete sua verificação de identidade e comece a dar lances. Todo o processo é 100% online e seguro.</p>
        </div>
      </section>

      <FaqBlock items={FAQ} title={`Perguntas sobre leilão de imóveis ${estado.prep} ${estado.nome}`} />
    </div>
  );
}
