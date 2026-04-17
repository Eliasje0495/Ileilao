import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Leilão de Máquinas e Equipamentos — Industrial e Agrícola | iLeilão",
  description: "Máquinas industriais, equipamentos agrícolas, tratores e implementos em leilão com até 60% de desconto. Leilões de máquinas de fábricas, órgãos públicos e bancos.",
  keywords: ["leilão de máquinas", "leilão equipamentos", "leilão industrial", "leilão maquinário agrícola", "trator leilão"],
  alternates: { canonical: "https://ileilao.com/leiloes/maquinas" },
};

const FAQ = [
  { q: "Posso inspecionar a máquina antes do leilão?", a: "Em muitos leilões de máquinas é possível agendar visita técnica. Recomendamos fortemente inspecionar o bem antes de dar o lance — verifique horários de visita no edital." },
  { q: "Quem vende máquinas em leilão?", a: "Bancos (retomadas de financiamento), fábricas em processo de recuperação judicial, órgãos públicos (frota municipal/estadual), e empresas em encerramento de atividades." },
  { q: "Como funciona o transporte?", a: "O frete e desmontagem são geralmente responsabilidade do arrematante. O edital especifica o local de retirada e o prazo (geralmente 3 a 15 dias após o pagamento)." },
  { q: "Máquina de leilão tem garantia?", a: "Não. Máquinas de leilão são vendidas no estado em que se encontram (as is). Por isso, a inspeção prévia é fundamental. Alguns leiloeiros oferecem laudo técnico — verifique o edital." },
];

export default function LeiloesMaquinasPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leilões", href: "/leiloes" }, { label: "Máquinas" }]} />

      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Leilão de Máquinas e Equipamentos</h1>
          <p className="text-gray-500 text-sm max-w-2xl mb-6">
            Máquinas industriais, agrícolas e equipamentos em leilão com até <strong className="text-gray-700">60% de desconto</strong>. Bancários, judiciais e de órgãos públicos.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: "Tratores", href: "/leiloes?categoria=MAQUINA&tipo=trator" },
              { label: "Industriais", href: "/leiloes?categoria=MAQUINA&tipo=industrial" },
              { label: "Agrícolas", href: "/leiloes?categoria=MAQUINA&tipo=agricola" },
              { label: "Construção", href: "/leiloes?categoria=MAQUINA&tipo=construcao" },
              { label: "Informática", href: "/leiloes?categoria=MAQUINA&tipo=informatica" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all">
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/leiloes?categoria=MAQUINA"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
            Ver máquinas em leilão →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🚜", title: "Agrícolas", desc: "Tratores, colheitadeiras, implementos e máquinas de irrigação de fazendas e cooperativas." },
            { icon: "🏭", title: "Industriais", desc: "Tornos, fresas, prensas, injetoras e linhas de produção completas de fábricas em liquidação." },
            { icon: "🏗️", title: "Construção Civil", desc: "Retroescavadeiras, motoniveladoras, caminhões betoneira e guindaste de obras públicas." },
            { icon: "💻", title: "TI e Informática", desc: "Servidores, computadores, equipamentos de rede e impressoras de órgãos públicos." },
            { icon: "🚛", title: "Frota", desc: "Caminhões, vans, ônibus e veículos de frota de empresas e municípios." },
            { icon: "⚡", title: "Energia", desc: "Geradores, transformadores e equipamentos elétricos industriais." },
          ].map(cat => (
            <div key={cat.title} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{cat.title}</div>
              <div className="text-xs text-gray-500">{cat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas sobre leilão de máquinas" />
    </div>
  );
}
