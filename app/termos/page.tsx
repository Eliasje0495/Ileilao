import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Termos de Uso — iLeilão",
  description: "Leia os Termos de Uso da plataforma iLeilão antes de se cadastrar.",
  alternates: { canonical: "https://ileilao.com/termos" },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    title: "1. Aceitação dos Termos",
    body: `Ao acessar ou utilizar a plataforma iLeilão ("Plataforma"), você ("Usuário") concorda com estes Termos de Uso. Caso não concorde, não utilize a Plataforma. A iLeilão reserva-se o direito de atualizar estes termos a qualquer momento, com aviso prévio por e-mail ou notificação na Plataforma.`,
  },
  {
    title: "2. Cadastro e Verificação de Identidade",
    body: `Para participar de leilões, o Usuário deve completar o cadastro com dados verídicos e passar pelo processo de verificação de identidade (KYC). O fornecimento de informações falsas implica no cancelamento imediato da conta e eventual responsabilidade civil e criminal.`,
  },
  {
    title: "3. Participação em Leilões",
    body: `A participação em leilões exige: (a) cadastro aprovado com KYC verificado; (b) depósito de caução no valor estipulado no edital; (c) leitura e aceitação do edital específico de cada lote. O lance é irrevogável após confirmação. O arrematante vencedor tem o prazo definido no edital para realizar o pagamento.`,
  },
  {
    title: "4. Caução",
    body: `A caução é retida via cartão de crédito ou PIX como garantia de participação. Será automaticamente liberada aos não vencedores em até 5 dias úteis após o encerramento do leilão. O vencedor que não efetuar o pagamento no prazo perde a caução, que pode ser destinada ao comitente vendedor conforme o edital.`,
  },
  {
    title: "5. Responsabilidades da iLeilão",
    body: `A iLeilão é uma plataforma de intermediação. Não é proprietária dos bens leiloados e não se responsabiliza por: (a) estado físico ou jurídico dos bens; (b) informações prestadas pelos comitentes vendedores; (c) eventuais vícios ocultos. Recomendamos sempre consultar um advogado antes de participar.`,
  },
  {
    title: "6. Comissão do Leiloeiro",
    body: `Sobre o valor do arremate incide a comissão do leiloeiro oficial, geralmente de 5%, conforme especificado no edital de cada lote. Esse valor é adicional ao lance vencedor e de responsabilidade do arrematante.`,
  },
  {
    title: "7. Propriedade Intelectual",
    body: `Todo o conteúdo da Plataforma (textos, imagens, logotipos, software) é de propriedade da iLeilão ou licenciado para uso. É proibida a reprodução, distribuição ou uso comercial sem autorização prévia por escrito.`,
  },
  {
    title: "8. Privacidade",
    body: `O tratamento de dados pessoais é regido pela nossa Política de Privacidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018). Ao se cadastrar, o Usuário consente com a coleta e tratamento de seus dados nos termos descritos na Política de Privacidade.`,
  },
  {
    title: "9. Foro e Lei Aplicável",
    body: `Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`,
  },
  {
    title: "10. Contato",
    body: `Para dúvidas sobre estes Termos, entre em contato pelo e-mail juridico@ileilao.com ou acesse nossa página de Contato.`,
  },
];

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-sm text-gray-400">Última atualização: 1 de abril de 2026</p>
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
          <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade →</Link>
          <Link href="/contato" className="text-blue-600 hover:underline">Contato →</Link>
        </div>
      </div>
    </div>
  );
}
