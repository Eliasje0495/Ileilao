import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

interface Props { params: Promise<{ uf: string }> }
export async function generateStaticParams() { return Object.keys(ESTADOS_MAP).map(uf => ({ uf })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf } = await params;
  const estado = ESTADOS_MAP[uf.toLowerCase()];
  if (!estado) return {};
  const prep = estado.prep.charAt(0).toUpperCase() + estado.prep.slice(1);
  return {
    title: `Leilão de Veículos ${prep} ${estado.nome} — Carros e Motos | iLeilão`,
    description: `Carros, motos e caminhões em leilão ${estado.prep} ${estado.nome} com até 70% de desconto. Veículos de bancos e seguradoras.`,
    alternates: { canonical: `https://ileilao.com/leiloes/veiculos/${uf.toLowerCase()}` },
  };
}

export default async function LeiloesVeiculosUfPage({ params }: Props) {
  const { uf } = await params;
  const estado = ESTADOS_MAP[uf.toLowerCase()];
  if (!estado) notFound();
  const prep = estado.prep.charAt(0).toUpperCase() + estado.prep.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[
        { label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" },
        { label: "Veículos", href: "/leiloes/veiculos" }, { label: estado.nome },
      ]} />
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Leilão de Veículos {prep} {estado.nome}</h1>
          <p className="text-gray-500 text-sm mb-4">Carros, motos e caminhões em leilão {estado.prep} {estado.nome} com até <strong>70% de desconto</strong>.</p>
          <Link href={`/leiloes?categoria=VEICULO&uf=${estado.uf}`}
            className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver veículos {estado.prep} {estado.nome} →
          </Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-600">A iLeilão reúne os melhores leilões de veículos {estado.prep} {estado.nome}, incluindo carros de bancos (retomados de financiamento), motos de seguradoras e veículos de frotas públicas com grandes descontos.</p>
        <div className="mt-6">
          <Link href="/leiloes/veiculos" className="text-sm text-blue-600 hover:underline">← Ver todos os estados</Link>
        </div>
      </section>
    </div>
  );
}
