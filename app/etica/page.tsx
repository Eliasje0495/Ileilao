import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Código de Ética — iLeilão",
  description: "Princípios éticos e de conduta que regem a operação da iLeilão e o relacionamento com usuários, leiloeiros e comitentes.",
  alternates: { canonical: "https://ileilao.com/etica" },
};

const SECTIONS = [
  {
    title: "1. Transparência",
    text: "A iLeilão compromete-se a fornecer informações claras, precisas e completas sobre todos os lotes disponíveis, incluindo valor de avaliação, débitos conhecidos, situação do imóvel e documentação disponível. Nunca ocultamos informações relevantes que possam impactar a decisão do participante.",
  },
  {
    title: "2. Imparcialidade",
    text: "Todos os participantes são tratados de forma igualitária, independentemente de histórico de compras, localização ou perfil de uso. O processo de lances é auditável e protegido por hash chain SHA-256, garantindo que nenhum lance seja manipulado ou favorecido.",
  },
  {
    title: "3. Proteção do consumidor",
    text: "Operamos em conformidade com o Código de Defesa do Consumidor (Lei 8.078/1990), a LGPD (Lei 13.709/2018) e demais normas aplicáveis. A caução é devolvida automaticamente aos não vencedores e nunca é retida indevidamente.",
  },
  {
    title: "4. Privacidade de dados",
    text: "Coletamos apenas os dados estritamente necessários para a operação da plataforma. Dados sensíveis como CPF são criptografados com AES-256-GCM. Nunca vendemos ou compartilhamos dados pessoais com terceiros para fins comerciais.",
  },
  {
    title: "5. Combate à fraude",
    text: "Mantemos mecanismos ativos de detecção de fraudes, incluindo verificação de identidade (KYC), análise de comportamento de lances e auditoria de transações. Contas suspeitas são bloqueadas e reportadas às autoridades competentes quando necessário.",
  },
  {
    title: "6. Responsabilidade dos leiloeiros",
    text: "Todos os leiloeiros credenciados na plataforma devem possuir matrícula ativa na Junta Comercial de seu estado (ex.: JUCESP) e operar em conformidade com o Decreto 21.981/1932. A iLeilão reserva-se o direito de descredenciar leiloeiros que violem padrões éticos.",
  },
  {
    title: "7. Comunicação ética",
    text: "Nossas comunicações de marketing são baseadas em fatos verificáveis. Não fazemos promessas de retorno financeiro garantido ou comparações enganosas com outros investimentos. Descontos divulgados são sempre calculados sobre o valor de avaliação oficial.",
  },
  {
    title: "8. Canal de denúncias",
    text: "Qualquer usuário pode reportar violações éticas pelo e-mail etica@ileilao.com. Todas as denúncias são investigadas com sigilo e respondidas em até 10 dias úteis. Retaliações contra denunciantes de boa-fé são expressamente proibidas.",
  },
];

export default function EticaPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />

      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Governança</p>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Código de Ética</h1>
          <p className="text-gray-500">
            Nossos princípios orientam cada decisão — do desenvolvimento de produto ao atendimento ao cliente.
            Última atualização: janeiro de 2026.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{s.text}</p>
          </div>
        ))}

        <div className="bg-blue-50 rounded-2xl p-6 mt-8">
          <h2 className="font-bold text-gray-900 mb-2">Canal de Ética</h2>
          <p className="text-sm text-gray-600 mb-3">
            Encontrou alguma irregularidade ou violação dos nossos princípios?
          </p>
          <a href="mailto:etica@ileilao.com"
            className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">
            etica@ileilao.com
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Dúvidas sobre este código? Consulte também nossa{" "}
          <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link> e{" "}
          <Link href="/termos" className="text-blue-600 hover:underline">Termos de Uso</Link>.
        </p>
      </section>
    </div>
  );
}
