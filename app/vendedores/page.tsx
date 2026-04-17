import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { FaqBlock } from "@/components/FaqBlock";

export const metadata: Metadata = {
  title: "Anuncie seu Leilão — Para Leiloeiros e Comitentes | iLeilão",
  description: "Publique seus lotes na maior plataforma de leilões online do Brasil. Alcance milhares de compradores verificados em todo o país.",
  alternates: { canonical: "https://ileilao.com/vendedores" },
};

const FAQ = [
  { q: "Quem pode publicar leilões na iLeilão?", a: "Leiloeiros oficiais credenciados pela Junta Comercial de qualquer estado, bancos, tribunais e empresas comitentes. Para publicar, é necessário enviar credenciais e passar por validação da nossa equipe." },
  { q: "Quanto custa publicar um lote?", a: "Entre em contato para conhecer nossos planos. Oferecemos opções para leiloeiros independentes, grandes volumes e instituições financeiras." },
  { q: "Quanto tempo leva para publicar um lote?", a: "Após aprovação do cadastro, a publicação de um lote leva menos de 10 minutos via nosso painel. Lotes com documentação completa são aprovados em até 2 horas." },
  { q: "A iLeilão realiza o leilão ou apenas publica?", a: "A iLeilão é uma plataforma de publicação e gestão. O leilão é conduzido pelo leiloeiro oficial responsável pelo lote, conforme exige a legislação brasileira." },
];

export default function VendedoresPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />

      <section className="bg-blue-900 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-blue-700 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4">Para leiloeiros e vendedores</div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Alcance milhares de compradores em todo o Brasil
            </h1>
            <p className="text-blue-200 text-sm mb-6 max-w-sm leading-relaxed">
              Publique seus lotes na iLeilão e conecte-se com compradores verificados, prontos para dar lances. Processo digital, ágil e totalmente rastreável.
            </p>
            <Link href="/contato" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black px-8 py-3 rounded-xl transition text-sm">
              Quero anunciar meus lotes →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: "47k+", label: "compradores ativos" },
              { num: "27", label: "estados cobertos" },
              { num: "98%", label: "lotes com lance" },
              { num: "< 2h", label: "publicação aprovada" },
            ].map(s => (
              <div key={s.label} className="bg-blue-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-yellow-400">{s.num}</div>
                <div className="text-xs text-blue-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Como funciona para vendedores</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: "1", icon: "📋", title: "Cadastre-se como leiloeiro", desc: "Envie suas credenciais e documentação. Aprovação em até 48h." },
            { step: "2", icon: "🏠", title: "Publique seus lotes", desc: "Adicione fotos, edital, documentos e defina o lance mínimo." },
            { step: "3", icon: "📡", title: "Leilão ao vivo", desc: "Compradores participam em tempo real pelo nosso auditório digital." },
            { step: "4", icon: "💰", title: "Receba o pagamento", desc: "Gestão completa de cauções, pagamentos e documentação pós-arrematação." },
          ].map(item => (
            <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <div className="w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center mx-auto mb-3">{item.step}</div>
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comitentes / Parceiros ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Quem já confia na iLeilão</h2>
        <p className="text-sm text-gray-500 text-center mb-10">Instituições financeiras, tribunais e empresas que publicam seus leilões conosco.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Col 1 */}
          <div>
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">Instituições Financeiras</h3>
            <ul className="space-y-2.5">
              {[
                "Banco Santander", "Itaú Unibanco S.A", "Banco Bradesco",
                "Banco Safra", "Banco Inter", "Banco Bari",
                "Banco Daycoval", "Banco Original", "Caixa Econômica Federal",
                "Banco do Brasil", "BTG Pactual", "BSP Empreendimentos Imobiliários",
              ].map(n => (
                <li key={n} className="text-sm text-gray-600 hover:text-blue-700 transition-colors cursor-default">{n}</li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">Leilão Judicial</h3>
            <ul className="space-y-2.5 mb-8">
              {[
                "TJSP — Tribunal de Justiça de SP",
                "TJPR — Tribunal de Justiça do Paraná",
                "TJRJ — Tribunal de Justiça do Rio",
                "TJMG — Tribunal de Justiça de MG",
                "TJRS — Tribunal de Justiça do RS",
                "Comprei",
              ].map(n => (
                <li key={n} className="text-sm text-gray-600 hover:text-blue-700 transition-colors cursor-default">{n}</li>
              ))}
            </ul>

            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">Securitizadoras</h3>
            <ul className="space-y-2.5">
              {[
                "Ore Securitizadora",
                "Flowinvest Fundo de Investimento",
                "High Fundo de Investimentos",
                "Galleria Home Equity",
                "GVC Geração de Valor em Cobrança",
              ].map(n => (
                <li key={n} className="text-sm text-gray-600 hover:text-blue-700 transition-colors cursor-default">{n}</li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">Empresas & Incorporadoras</h3>
            <ul className="space-y-2.5">
              {[
                "Banco Sicoob", "Creditas Soluções Financeiras",
                "Enforce", "Engeform",
                "F A Oliva & Cia", "Lichtenberg",
                "Outros Comitentes", "Pacaembu Construtora",
                "Porto Seguro", "Sicredi",
                "SPGPrints", "Unicos Incorporadora e Urbanismo",
                "ITV Urbanismo", "Banco do Estado de Sergipe S/A",
              ].map(n => (
                <li key={n} className="text-sm text-gray-600 hover:text-blue-700 transition-colors cursor-default">{n}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/contato" className="inline-block border border-blue-200 text-blue-700 text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition">
            Quero ser um comitente →
          </Link>
        </div>
      </section>

      <section className="bg-blue-600 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Pronto para publicar seus lotes?</h2>
          <p className="text-blue-100 text-sm mb-5">Entre em contato e nossa equipe apresenta os planos disponíveis.</p>
          <Link href="/contato" className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
            Falar com nossa equipe →
          </Link>
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas de vendedores" />
    </div>
  );
}
