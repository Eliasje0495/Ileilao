// lib/seo-data.ts — Central SEO data for all static pages

export const ESTADOS_MAP: Record<string, { nome: string; prep: string; uf: string }> = {
  ac: { nome: "Acre",              prep: "no",  uf: "AC" },
  al: { nome: "Alagoas",           prep: "em",  uf: "AL" },
  ap: { nome: "Amapá",             prep: "no",  uf: "AP" },
  am: { nome: "Amazonas",          prep: "no",  uf: "AM" },
  ba: { nome: "Bahia",             prep: "na",  uf: "BA" },
  ce: { nome: "Ceará",             prep: "no",  uf: "CE" },
  df: { nome: "Distrito Federal",  prep: "no",  uf: "DF" },
  es: { nome: "Espírito Santo",    prep: "no",  uf: "ES" },
  go: { nome: "Goiás",             prep: "em",  uf: "GO" },
  ma: { nome: "Maranhão",          prep: "no",  uf: "MA" },
  mt: { nome: "Mato Grosso",       prep: "no",  uf: "MT" },
  ms: { nome: "Mato Grosso do Sul",prep: "no",  uf: "MS" },
  mg: { nome: "Minas Gerais",      prep: "em",  uf: "MG" },
  pa: { nome: "Pará",              prep: "no",  uf: "PA" },
  pb: { nome: "Paraíba",           prep: "na",  uf: "PB" },
  pr: { nome: "Paraná",            prep: "no",  uf: "PR" },
  pe: { nome: "Pernambuco",        prep: "em",  uf: "PE" },
  pi: { nome: "Piauí",             prep: "no",  uf: "PI" },
  rj: { nome: "Rio de Janeiro",    prep: "no",  uf: "RJ" },
  rn: { nome: "Rio Grande do Norte",prep:"no",  uf: "RN" },
  rs: { nome: "Rio Grande do Sul", prep: "no",  uf: "RS" },
  ro: { nome: "Rondônia",          prep: "em",  uf: "RO" },
  rr: { nome: "Roraima",           prep: "em",  uf: "RR" },
  sc: { nome: "Santa Catarina",    prep: "em",  uf: "SC" },
  sp: { nome: "São Paulo",         prep: "em",  uf: "SP" },
  se: { nome: "Sergipe",           prep: "em",  uf: "SE" },
  to: { nome: "Tocantins",         prep: "no",  uf: "TO" },
};

export const BANCO_MAP: Record<string, { name: string; fullName: string; desc: string }> = {
  itau:      { name: "Itaú",       fullName: "Itaú Unibanco S.A.",              desc: "O Itaú Unibanco realiza leilões de imóveis retomados de clientes inadimplentes. São apartamentos, casas, terrenos e imóveis comerciais financiados, disponíveis com grandes descontos." },
  bradesco:  { name: "Bradesco",   fullName: "Banco Bradesco S.A.",             desc: "O Bradesco leiloa imóveis retomados por alienação fiduciária ou execução hipotecária. Encontre apartamentos, casas e terrenos em todo o Brasil com descontos de até 60%." },
  caixa:     { name: "Caixa",      fullName: "Caixa Econômica Federal",         desc: "A Caixa Econômica Federal realiza leilões de imóveis financiados pelo SFH (Sistema Financeiro de Habitação). São centenas de apartamentos e casas com condições especiais de pagamento." },
  santander: { name: "Santander",  fullName: "Banco Santander (Brasil) S.A.",   desc: "O Santander disponibiliza imóveis e veículos em leilão com descontos expressivos. Imóveis residenciais, comerciais e rurais em todas as regiões do Brasil." },
  bb:        { name: "Banco do Brasil", fullName: "Banco do Brasil S.A.",       desc: "O Banco do Brasil realiza leilões de imóveis, veículos, máquinas e equipamentos agrícolas. Boas oportunidades para quem busca investir ou adquirir o primeiro imóvel." },
  inter:     { name: "Banco Inter", fullName: "Banco Inter S.A.",               desc: "O Banco Inter leiloa imóveis retomados de financiamentos inadimplentes. Apartamentos e casas disponíveis para lance com condições vantajosas de pagamento." },
  sicoob:    { name: "Sicoob",     fullName: "Sicoob — Cooperativas de Crédito", desc: "O Sicoob disponibiliza leilões de imóveis, veículos e bens diversos oriundos de operações de crédito em atraso. Boas oportunidades em regiões do interior do Brasil." },
  tjsp:      { name: "TJSP",       fullName: "Tribunal de Justiça de São Paulo", desc: "Leilões judiciais do TJSP são a maior fonte de imóveis em hasta pública no Brasil. Apartamentos, casas e terrenos em São Paulo disponibilizados por decisão judicial." },
};

export const GLOSSARIO_TERMS = [
  { slug: "alienacao-fiduciaria",  termo: "Alienação Fiduciária",     def: "Modalidade de garantia em que o devedor transfere a propriedade do bem ao credor (banco) até a quitação do financiamento. Em caso de inadimplência, o banco pode leiloar o imóvel extrajudicialmente com base na Lei 9.514/97." },
  { slug: "arrematante",           termo: "Arrematante",              def: "Pessoa física ou jurídica que vence um leilão com o maior lance, adquirindo o direito de propriedade sobre o bem leiloado. O arrematante deve pagar o valor do arremate e a comissão do leiloeiro." },
  { slug: "caucao",                termo: "Caução",                   def: "Depósito de garantia realizado pelo participante antes de dar lances em um leilão. Garante a seriedade da participação e é devolvido automaticamente aos não vencedores." },
  { slug: "edital",                termo: "Edital de Leilão",         def: "Documento oficial que contém todas as regras do leilão: descrição do bem, valor mínimo, data, forma de pagamento, responsabilidades do arrematante e condições legais. A leitura do edital é obrigatória antes de participar." },
  { slug: "leiloeiro",             termo: "Leiloeiro Oficial",        def: "Profissional habilitado pela Junta Comercial (JUCESP) para conduzir leilões de forma legal. Responsável por publicar editais, conduzir sessões de lances e emitir o auto de arrematação." },
  { slug: "hasta-publica",         termo: "Hasta Pública",            def: "Denominação jurídica para o leilão realizado por determinação judicial. O bem é vendido publicamente pelo maior lance, podendo ser em 1ª ou 2ª praça." },
  { slug: "lance-minimo",          termo: "Lance Mínimo",             def: "Valor inicial mínimo aceito para participação no leilão. No 1º leilão, geralmente equivale ao valor de avaliação do bem. No 2º leilão, pode ser menor." },
  { slug: "primeira-praca",        termo: "Primeira Praça",           def: "No leilão judicial, é a primeira rodada de lances. O valor mínimo é geralmente o valor de avaliação do bem. Se não houver licitantes, realiza-se a segunda praça." },
  { slug: "segunda-praca",         termo: "Segunda Praça",            def: "No leilão judicial, é a segunda rodada de lances, realizada quando a primeira não tem compradores. O valor mínimo pode ser reduzido para até 50% da avaliação." },
  { slug: "comitente",             termo: "Comitente Vendedor",       def: "Entidade que disponibiliza o bem para leilão, geralmente um banco, tribunal ou empresa. É quem autoriza o leiloeiro a realizar a venda." },
  { slug: "arrematacao",           termo: "Arrematação",              def: "Ato de vencer o leilão com o maior lance válido. Após a arrematação, o vencedor deve pagar o valor acordado e recebe o Auto de Arrematação, documento que comprova a aquisição." },
  { slug: "imissao-na-posse",      termo: "Imissão na Posse",         def: "Processo judicial ou administrativo pelo qual o arrematante toma posse física do imóvel adquirido em leilão. Necessária quando o bem está ocupado pelo antigo proprietário ou inquilinos." },
  { slug: "debitos-pendentes",     termo: "Débitos Pendentes",        def: "Dívidas vinculadas ao imóvel (IPTU, condomínio, água, luz) que podem ou não ser transferidas ao arrematante. O edital especifica quais débitos são responsabilidade do comprador — leia com atenção." },
  { slug: "bem-de-familia",        termo: "Bem de Família",           def: "Imóvel residencial único protegido pela Lei 8.009/90 contra penhora e execução. Porém, imóveis dados como garantia em alienação fiduciária perdem essa proteção e podem ser leiloados." },
  { slug: "incremento-minimo",     termo: "Incremento Mínimo",        def: "Valor mínimo que cada novo lance deve superar o anterior. Definido no edital, garante que os lances aumentem de forma ordenada durante a sessão." },
];

export const BLOG_POSTS = [
  {
    slug: "judicial-extrajudicial",
    title: "Leilão Judicial vs Extrajudicial: Diferenças e Riscos",
    excerpt: "Entenda as principais diferenças entre leilões judiciais e extrajudiciais, os riscos de cada modalidade e como se proteger na hora de arrematar.",
    date: "2026-04-01",
    category: "Guia",
    readTime: "8 min",
    content: `
Um dos maiores pontos de dúvida de quem está começando no mundo dos leilões é a diferença entre **leilão judicial** e **leilão extrajudicial**. Embora ambos sirvam para vender bens que foram dados como garantia de dívidas não pagas, existem diferenças importantes nos processos, riscos e oportunidades.

## O que é um leilão judicial?

O leilão judicial ocorre quando um juiz determina a venda de um bem para saldar dívidas reconhecidas em processo judicial. Pode ser resultado de execução de dívida, partilha de herança, separação conjugal ou outros processos.

**Fundamento legal:** Artigos 879 a 903 do Novo Código de Processo Civil (Lei 13.105/2015).

### Como funciona?
1. Um juiz determina a penhora do bem
2. O bem é avaliado por perito judicial
3. É publicado edital de leilão
4. Realiza-se o 1º e eventualmente o 2º leilão (hasta pública)
5. O arrematante obtém carta de arrematação

### Principais riscos
- Imóvel pode estar ocupado (desocupação é responsabilidade do comprador)
- Pode haver recursos judiciais que atrasam a entrega do bem
- Dívidas de IPTU e condomínio podem ser do arrematante

## O que é um leilão extrajudicial?

O leilão extrajudicial ocorre fora do judiciário, geralmente por bancos que retomam imóveis financiados após inadimplência. A modalidade mais comum é a **alienação fiduciária** (Lei 9.514/97).

### Como funciona?
1. Devedor fica inadimplente no financiamento
2. Banco notifica o devedor (prazo de 15 dias para pagar)
3. Banco consolida a propriedade do imóvel
4. Realiza-se o leilão extrajudicial em até 30 dias

### Vantagens sobre o leilão judicial
- Processo mais rápido e menos sujeito a recursos
- Título de propriedade mais "limpo"
- Menor risco de anulação judicial

## Qual é mais seguro?

Para a maioria dos compradores, o **leilão extrajudicial tende a ser mais seguro** por ter processo mais claro e menos sujeito a impugnações. Porém, cada lote é único — a leitura atenta do edital é sempre obrigatória.
    `,
  },
  {
    slug: "imovel-ocupado",
    title: "Imóvel Ocupado em Leilão: O Que Fazer Após o Arremate",
    excerpt: "Comprou um imóvel ocupado em leilão? Saiba quais são seus direitos, como funciona a imissão na posse e o que fazer se o ocupante não sair.",
    date: "2026-04-05",
    category: "Guia",
    readTime: "6 min",
    content: `
Comprar um imóvel ocupado em leilão é comum e pode parecer assustador, mas é um processo regulamentado por lei. Com o conhecimento certo, você pode tomar posse do seu imóvel de forma tranquila.

## O que significa "imóvel ocupado"?

Quando o edital indica que o imóvel está ocupado, significa que há alguém morando ou usando o bem — geralmente o antigo proprietário, um inquilino ou um familiar.

## Imissão na posse: seu direito legal

Após o arremate, você tem direito à **imissão na posse** — o processo de tomar posse física do imóvel. Para isso:

1. **Comunique ao ocupante** que o imóvel foi arrematado e solicite a desocupação voluntária
2. **Dê prazo razoável** (geralmente 30-60 dias)
3. Se não sair, entre com **ação de imissão na posse** no tribunal

## Ação de imissão na posse

Esta ação judicial é relativamente simples quando baseada em arrematação judicial. Você precisará apresentar:
- Auto de arrematação ou carta de arrematação
- Comprovante de pagamento
- Matrícula do imóvel atualizada

O processo geralmente dura entre 3 e 12 meses, dependendo da vara e do estado.

## Dicas práticas

- **Antes do leilão:** visite o endereço para avaliar a situação do ocupante
- **Calcule o custo:** inclua possíveis custos jurídicos de desocupação no seu cálculo de retorno
- **Desconto pela ocupação:** imóveis ocupados costumam ter descontos maiores — considere isso na hora de dar o lance
    `,
  },
  {
    slug: "como-ler-edital",
    title: "Como Ler um Edital de Leilão: Os 10 Pontos Mais Importantes",
    excerpt: "O edital é o documento mais importante em um leilão. Aprenda o que verificar antes de dar qualquer lance.",
    date: "2026-04-10",
    category: "Guia",
    readTime: "7 min",
    content: `
O edital de leilão é o documento que define todas as regras da compra. Ignorá-lo pode custar caro. Veja os 10 pontos que você deve verificar antes de qualquer lance.

## 1. Descrição completa do bem
Verifique se a descrição corresponde ao que você pesquisou. Endereço, metragem, matrícula do cartório de registro de imóveis.

## 2. Situação de ocupação
Desocupado = você pode entrar imediatamente após a arrematação. Ocupado = você precisará de ação judicial para tomar posse.

## 3. Dívidas de responsabilidade do arrematante
O edital deve listar quais débitos são transferidos ao comprador: IPTU atrasado, dívidas de condomínio, taxas de água/luz.

## 4. Formas de pagamento aceitas
À vista, parcelado, ou com possibilidade de financiamento bancário? Verifique os percentuais de entrada e prazos.

## 5. Comissão do leiloeiro
Geralmente 5% sobre o valor do arremate. É adicional ao valor do lance — calcule isso no seu orçamento.

## 6. Data e horário dos leilões
1ª e 2ª praça com datas e horários distintos. Se a 1ª praça não tiver lances, o imóvel vai a 2ª praça com valor reduzido.

## 7. Valor de avaliação vs. lance mínimo
O valor de avaliação indica o preço de mercado estimado. O lance mínimo é o valor a partir do qual os lances são aceitos.

## 8. Ônus reais sobre o imóvel
Hipotecas, penhoras ou outros gravames que persistem após a arrematação. Consulte a certidão de matrícula atualizada.

## 9. Prazo para pagamento
Após o arremate, você tem um prazo definido (geralmente 24-48 horas) para realizar o pagamento. Não cumprir pode resultar em perda da caução.

## 10. Responsabilidade por regularização
Quem é responsável por regularizar a documentação do imóvel? Em alguns casos, é o arrematante.
    `,
  },
];
