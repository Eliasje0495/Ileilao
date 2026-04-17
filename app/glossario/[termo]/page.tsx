import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GLOSSARIO_TERMS } from "@/lib/seo-data";

export const revalidate = 3600;

interface Props { params: Promise<{ termo: string }> }

export async function generateStaticParams() {
  return GLOSSARIO_TERMS.map(t => ({ termo: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { termo } = await params;
  const term = GLOSSARIO_TERMS.find(t => t.slug === termo);
  if (!term) return {};
  return {
    title: `${term.termo} — O que é? Definição e Exemplos | iLeilão`,
    description: term.def.slice(0, 155),
    alternates: { canonical: `https://ileilao.com/glossario/${termo}` },
  };
}

export default async function GlossarioTermoPage({ params }: Props) {
  const { termo } = await params;
  const term = GLOSSARIO_TERMS.find(t => t.slug === termo);
  if (!term) notFound();

  const others = GLOSSARIO_TERMS.filter(t => t.slug !== termo).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.termo,
    description: term.def,
    inDefinedTermSet: "https://ileilao.com/glossario",
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Glossário", href: "/glossario" },
        { label: term.termo },
      ]} />

      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Glossário de Leilões
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{term.termo}</h1>
          <p className="text-gray-600 text-base leading-relaxed">{term.def}</p>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <Link href="/leiloes"
              className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">
              Ver leilões →
            </Link>
            <Link href="/como-funciona"
              className="inline-block border border-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm">
              Como funciona?
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Outros termos do glossário</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {others.map(t => (
              <Link key={t.slug} href={`/glossario/${t.slug}`}
                className="block bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition group">
                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{t.termo}</div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{t.def}</div>
              </Link>
            ))}
          </div>
          <Link href="/glossario" className="text-xs text-blue-600 hover:underline mt-3 inline-block">
            Ver todos os termos →
          </Link>
        </div>
      </section>
    </div>
  );
}
