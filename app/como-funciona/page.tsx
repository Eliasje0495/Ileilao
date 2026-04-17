import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqBlock } from "@/components/FaqBlock";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Como Funciona o Leilão Online — Passo a Passo | iLeilão",
  description: "Aprenda como participar de um leilão online na iLeilão: cadastro, verificação de identidade, caução, como dar lances e o que fazer após arrematar.",
  keywords: ["como funciona leilão", "participar leilão online", "como dar lance leilão", "leilão passo a passo"],
  alternates: { canonical: "https://ileilao.com/como-funciona" },
};

const STEPS = [
  {
    num: "01",
    icon: "👤",
    title: "Crie sua conta grátis",
    desc: "Cadastre-se com seu e-mail e crie uma senha segura. Leva menos de 2 minutos. Não há taxa de cadastro.",
    detail: "Você pode navegar e favoritar lotes sem conta, mas precisa de cadastro para dar lances.",
  },
  {
    num: "02",
    icon: "🪪",
    title: "Verifique sua identidade (KYC)",
    desc: "Envie um documento de identidade (CNH ou RG) e faça a selfie de verificação. Processo 100% online.",
    detail: "A verificação de identidade é obrigatória por lei para participar de leilões. Normalmente leva menos de 24 horas para ser aprovada.",
  },
  {
    num: "03",
    icon: "📄",
    title: "Leia o edital",
    desc: "Antes de qualquer lance, leia o edital completo do lote. Ali estão todas as regras, dívidas, prazo de pagamento e condições.",
    detail: "O edital é o documento mais importante. Ele define suas responsabilidades como arrematante — nunca pule essa etapa.",
  },
  {
    num: "04",
    icon: "💰",
    title: "Deposite a caução",
    desc: "Deposite a garantia exigida pelo lote (geralmente 5-20% do valor mínimo). A caução é devolvida se você não vencer.",
    detail: "A caução é retida via cartão de crédito ou PIX. Só é cobrada em definitivo se você arrematar e não pagar no prazo.",
  },
  {
    num: "05",
    icon: "🔨",
    title: "Dê o seu lance",
    desc: "Na data marcada, acesse o lote e dê seu lance. Você pode acompanhar ao vivo e aumentar o lance conforme necessário.",
    detail: "Nosso sistema de lance automático permite que você defina um valor máximo — o sistema dá lances automaticamente até esse limite.",
  },
  {
    num: "06",
    icon: "🏆",
    title: "Venceu? Finalize a compra",
    desc: "Se você for o vencedor, você terá o prazo do edital (geralmente 24-48h) para realizar o pagamento total.",
    detail: "Pagamento via PIX, TED ou parcelamento (quando disponível no edital). Após o pagamento, você recebe o auto de arrematação.",
  },
];

const FAQ = [
  { q: "Preciso pagar para me cadastrar?", a: "Não. O cadastro na iLeilão é totalmente gratuito. Você só paga a caução antes de dar lances (devolvida se não vencer) e o valor do arremate se vencer." },
  { q: "Posso participar de vários leilões ao mesmo tempo?", a: "Sim, você pode ter caução depositada em múltiplos lotes simultaneamente. Cada lote requer uma caução separada." },
  { q: "O que acontece se eu vencer e não pagar?", a: "Se você vencer e não pagar no prazo do edital, você perde a caução depositada e pode ser impedido de participar de futuros leilões na plataforma." },
  { q: "Como recebo o imóvel após o arremate?", a: "Após o pagamento, você recebe o auto de arrematação (leilão judicial) ou escritura pública (leilão extrajudicial). Com esse documento, você registra o imóvel em seu nome no Cartório de Registro de Imóveis." },
  { q: "Posso cancelar um lance?", a: "Não. Lances são irrevogáveis — uma vez confirmado, o lance não pode ser cancelado. Por isso, leia o edital com atenção antes de participar." },
  { q: "E se o leilão não tiver lances suficientes?", a: "Se não houver lances acima do mínimo na 1ª praça, o lote vai para 2ª praça com valor reduzido. Se ainda assim não houver lances, o leilão pode ser suspenso ou remarcado." },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Como Funciona" }]} />

      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-xs font-medium text-blue-700 mb-4">
            100% Online
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Como funciona o leilão na iLeilão</h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Participar de um leilão online é simples e seguro. Siga os 6 passos abaixo e comece a arrematar imóveis, veículos e muito mais.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-100 hidden md:block" />
          <div className="space-y-6">
            {STEPS.map(step => (
              <div key={step.num} className="relative flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-blue-200 rounded-full flex flex-col items-center justify-center z-10 shadow-sm">
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-xs font-bold text-blue-600">{step.num}</span>
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-1">{step.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{step.desc}</p>
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Pronto para começar?</h2>
          <p className="text-blue-100 text-sm mb-6">Cadastre-se grátis e explore centenas de lotes com descontos de até 80%.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/register"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition text-sm">
              Criar conta grátis
            </Link>
            <Link href="/leiloes"
              className="border border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm">
              Ver leilões →
            </Link>
          </div>
        </div>
      </section>

      <FaqBlock items={FAQ} title="Perguntas frequentes sobre como participar" />
    </div>
  );
}
