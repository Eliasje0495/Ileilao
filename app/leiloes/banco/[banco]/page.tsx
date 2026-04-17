import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";
import { BANCO_MAP, ESTADOS_MAP } from "@/lib/seo-data";

export const revalidate = 3600;

interface Props { params: Promise<{ banco: string }> }

export async function generateStaticParams() {
  return Object.keys(BANCO_MAP).map(banco => ({ banco }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { banco } = await params;
  const b = BANCO_MAP[banco.toLowerCase()];
  if (!b) return {};
  return {
    title: `Leilão ${b.name} — Imóveis e Veículos em Leilão | iLeilão`,
    description: `${b.desc} Encontre os melhores lotes em leilão ${b.name} com descontos de até 70%.`,
    alternates: { canonical: `https://ileilao.com/leiloes/banco/${banco.toLowerCase()}` },
  };
}

export default async function LeiloesBancoPage({ params }: Props) {
  const { banco } = await params;
  const b = BANCO_MAP[banco.toLowerCase()];
  if (!b) notFound();

  const FAQ = [
    { q: `Como participar de leilão do ${b.name}?`, a: `Para participar dos leilões do ${b.name}, cadastre-se gratuitamente na iLeilão, complete sua verificação de identidade, deposite a caução exigida no edital e dê seu lance online na data marcada.` },
    { q: `Imóveis do ${b.name} em leilão têm dívidas?`, a: `Em leilões extrajudiciais (alienação fiduciária), o ${b.name} geralmente quita IPTU e condomínio atrasados antes do leilão. O arrematante recebe o imóvel livre desses débitos — confirme lendo o edital do lote específico.` },
    { q: `Posso financiar imóvel de leilão do ${b.name}?`, a: b.name === "Caixa" ? "Sim! A Caixa Econômica Federal aceita financiamento FGTS e habitacional em muitos lotes de seus leilões. Verifique a disponibilidade no edital de cada lote." : `Leilões do ${b.name} geralmente exigem pagamento à vista ou em curto prazo. Em alguns casos há parcelamento — verifique o edital do lote.` },
    { q: `Com que frequência o ${b.name} realiza leilões?`, a: `O ${b.name} realiza leilões mensalmente, com centenas de lotes em todo o Brasil. A iLeilão agrega todos os lotes do ${b.name} em uma plataforma unificada com alertas por e-mail.` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[
        { label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" },
        { label: "Por banco" }, { label: b.name },
      ]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leilão {b.name}</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">{b.desc}</p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href={`/leiloes?categoria=IMOVEL&banco=${banco}`}
              className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
              Imóveis
            </Link>
            <Link href={`/leiloes?categoria=VEICULO&banco=${banco}`}
              className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
              Veículos
            </Link>
            <Link href={`/leiloes?tipo=extrajudicial&banco=${banco}`}
              className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
              Extrajudiciais
            </Link>
          </div>
          <Link href={`/leiloes?banco=${banco}`}
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver todos os lotes do {b.name} →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Leilões {b.name} por estado</h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ESTADOS_MAP).map(([slug, e]) => (
              <Link key={slug} href={`/leiloes/imoveis/${slug}`}
                className="text-center py-2 px-1 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-700 transition bg-white">
                {e.uf}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Outros bancos</h2>
          <div className="space-y-2">
            {Object.entries(BANCO_MAP).filter(([slug]) => slug !== banco.toLowerCase()).map(([slug, bk]) => (
              <Link key={slug} href={`/leiloes/banco/${slug}`}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{bk.name}</span>
                <span className="text-blue-400 text-xs">Ver leilões →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqBlock items={FAQ} title={`Perguntas sobre leilão ${b.name}`} />
    </div>
  );
}
