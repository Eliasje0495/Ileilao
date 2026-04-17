import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Política de Privacidade — iLeilão",
  description: "Como a iLeilão coleta, usa e protege seus dados pessoais conforme a LGPD.",
  alternates: { canonical: "https://ileilao.com/privacidade" },
};

const SECTIONS = [
  {
    title: "1. Quem somos",
    body: `A iLeilão é uma plataforma digital de leilões online operada pela iLeilão Tecnologia Ltda., com sede em São Paulo/SP. Para dúvidas sobre privacidade, contate nosso DPO em privacidade@ileilao.com.`,
  },
  {
    title: "2. Dados que coletamos",
    body: `Coletamos: (a) dados de cadastro: nome, e-mail, telefone, CPF/CNPJ, endereço; (b) dados de verificação de identidade (KYC): documento de identidade, selfie; (c) dados de uso: lances dados, lotes visualizados, preferências; (d) dados de pagamento: processados de forma segura via Stripe — não armazenamos dados de cartão; (e) dados de navegação: IP, cookies, tipo de dispositivo.`,
  },
  {
    title: "3. Como usamos seus dados",
    body: `Usamos seus dados para: verificar sua identidade (KYC obrigatório por lei); processar lances e pagamentos; enviar alertas de leilões personalizados; cumprir obrigações legais e regulatórias; melhorar a Plataforma; comunicações de marketing (com consentimento).`,
  },
  {
    title: "4. Base legal (LGPD)",
    body: `O tratamento de dados é baseado em: (a) execução de contrato — para operar sua conta e processar transações; (b) obrigação legal — KYC e registros financeiros exigidos por lei; (c) legítimo interesse — segurança, prevenção a fraudes; (d) consentimento — para comunicações de marketing.`,
  },
  {
    title: "5. Compartilhamento de dados",
    body: `Compartilhamos dados com: leiloeiros oficiais (necessário para o processo de arrematação); parceiros de KYC (verificação de identidade); processadores de pagamento (Stripe); prestadores de serviço de e-mail (Resend); autoridades públicas quando exigido por lei. Não vendemos seus dados a terceiros.`,
  },
  {
    title: "6. Retenção de dados",
    body: `Mantemos seus dados enquanto sua conta estiver ativa. Após o encerramento, retemos dados pelo prazo mínimo exigido pela legislação brasileira (geralmente 5 anos para registros financeiros). Dados de KYC seguem os prazos definidos pelo COAF e Banco Central.`,
  },
  {
    title: "7. Seus direitos (LGPD)",
    body: `Você tem direito a: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos ou inexatos; solicitar anonimização, bloqueio ou eliminação; portabilidade; revogar consentimento. Para exercer esses direitos, acesse Minha Conta ou envie e-mail para privacidade@ileilao.com.`,
  },
  {
    title: "8. Cookies",
    body: `Utilizamos cookies essenciais (necessários para o funcionamento), analíticos (Google Analytics, anonimizados) e de preferências. Você pode gerenciar cookies nas configurações do seu navegador. Cookies essenciais não podem ser desabilitados.`,
  },
  {
    title: "9. Segurança",
    body: `Adotamos medidas técnicas e organizacionais para proteger seus dados: criptografia AES-256 para dados sensíveis (CPF), HTTPS em toda a Plataforma, controle de acesso por função, monitoramento de atividades suspeitas. Em caso de incidente de segurança, notificaremos a ANPD e os usuários afetados no prazo legal.`,
  },
  {
    title: "10. Contato e DPO",
    body: `Encarregado de Dados (DPO): privacidade@ileilao.com. Autoridade supervisora: ANPD — Autoridade Nacional de Proteção de Dados (gov.br/anpd).`,
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-sm text-gray-400">Última atualização: 1 de abril de 2026 · Em conformidade com a LGPD (Lei 13.709/2018)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {SECTIONS.map((s) => (
            <div key={s.title} className="p-6">
              <h2 className="text-base font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/termos" className="text-blue-600 hover:underline">Termos de Uso →</Link>
          <Link href="/contato" className="text-blue-600 hover:underline">Contato DPO →</Link>
        </div>
      </div>
    </div>
  );
}
