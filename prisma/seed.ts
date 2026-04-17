// prisma/seed.ts — seed realistic Brazilian auction data
import { PrismaClient, Role, KycStatus, LotCategory, LotStatus, AuctionStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// p(type, seed) — returns a picsum URL with a consistent seed
// type: "i"=imovel, "v"=veiculo, "m"=maquina, "d"=diversos
function p(type: string, seed: number): string {
  return `https://picsum.photos/seed/${type}${seed}/800/600`;
}

const LOTS_DATA = [
  // ── Imóveis ──────────────────────────────────────────────────────────────────
  {
    title: "Apartamento 3 quartos — Ibirapuera, São Paulo/SP",
    description: "Apartamento residencial com 98m² útil, 2 vagas de garagem, salão de festas e piscina. Excelente localização próximo ao Parque Ibirapuera. Desocupado e pronto para imissão na posse.",
    category: LotCategory.IMOVEL,
    startPrice: 380000,
    minIncrement: 5000,
    appraisalValue: 655000,
    uf: "SP",
    cidade: "São Paulo",
    images: [p("i", 49), p("i", 50), p("i", 10), p("i", 20)],
  },
  {
    title: "Casa 4 quartos com piscina — Curitiba/PR",
    description: "Casa residencial com 240m² de área construída, 4 dormitórios sendo 1 suíte, piscina, churrasqueira e jardim. Bairro nobre de Curitiba. Imóvel desocupado.",
    category: LotCategory.IMOVEL,
    startPrice: 520000,
    minIncrement: 10000,
    appraisalValue: 840000,
    uf: "PR",
    cidade: "Curitiba",
    images: [p("i", 43), p("i", 49), p("i", 50)],
  },
  {
    title: "Cobertura duplex — Meireles, Fortaleza/CE",
    description: "Cobertura com 180m² útil, 3 suítes, terraço privativo com vista para o mar, 3 vagas de garagem. Condomínio de alto padrão com portaria 24h.",
    category: LotCategory.IMOVEL,
    startPrice: 650000,
    minIncrement: 15000,
    appraisalValue: 1200000,
    uf: "CE",
    cidade: "Fortaleza",
    images: [p("i", 57), p("i", 65), p("i", 77)],
  },
  {
    title: "Conjunto comercial 120m² — Asa Sul, Brasília/DF",
    description: "Conjunto comercial no coração da Asa Sul, 120m², 2 vagas de garagem, acabamento de alto padrão, piso frio e ar-condicionado central.",
    category: LotCategory.IMOVEL,
    startPrice: 290000,
    minIncrement: 5000,
    appraisalValue: 547000,
    uf: "DF",
    cidade: "Brasília",
    images: [p("i", 103), p("i", 119)],
  },
  {
    title: "Terreno 800m² — Jurerê Internacional, Florianópolis/SC",
    description: "Terreno plano de 800m² em área nobre de Florianópolis, próximo à praia de Jurerê Internacional. Documentação regularizada, matrícula limpa.",
    category: LotCategory.IMOVEL,
    startPrice: 180000,
    minIncrement: 5000,
    appraisalValue: 400000,
    uf: "SC",
    cidade: "Florianópolis",
    images: [p("i", 124), p("i", 137)],
  },
  {
    title: "Apartamento 2 quartos — Copacabana, Rio de Janeiro/RJ",
    description: "Apartamento a 300m da praia de Copacabana, 75m², 1 vaga, vista parcial para o mar. Prédio com porteiro. Documentação em dia.",
    category: LotCategory.IMOVEL,
    startPrice: 420000,
    minIncrement: 10000,
    appraisalValue: 780000,
    uf: "RJ",
    cidade: "Rio de Janeiro",
    images: [p("i", 145), p("i", 163)],
  },
  {
    title: "Galpão industrial 1.200m² — Contagem/MG",
    description: "Galpão industrial com 1.200m² de área construída, pé-direito de 8m, 3 docas de carga, área administrativa de 200m², estacionamento para caminhões.",
    category: LotCategory.IMOVEL,
    startPrice: 800000,
    minIncrement: 20000,
    appraisalValue: 1500000,
    uf: "MG",
    cidade: "Contagem",
    images: [p("i", 167), p("i", 10)],
  },
  {
    title: "Casa de campo 5 alqueires — Campinas/SP",
    description: "Propriedade rural com 5 alqueires, casa sede de 300m², piscina, curral, dois poços artesianos e 2 km de divisa cercada. Excelente para lazer ou produção.",
    category: LotCategory.IMOVEL,
    startPrice: 950000,
    minIncrement: 25000,
    appraisalValue: 1800000,
    uf: "SP",
    cidade: "Campinas",
    images: [p("i", 20), p("i", 43)],
  },
  // ── Veículos ─────────────────────────────────────────────────────────────────
  {
    title: "Toyota Corolla XEI 2022 — Rio de Janeiro/RJ",
    description: "Toyota Corolla XEI 2022, 25.000km, automático, cor prata, air bag, câmera de ré, central multimídia. Único dono, sem sinistros. IPVA pago.",
    category: LotCategory.VEICULO,
    startPrice: 68000,
    minIncrement: 1000,
    appraisalValue: 98500,
    uf: "RJ",
    cidade: "Rio de Janeiro",
    images: [p("v", 180), p("v", 222), p("v", 238)],
  },
  {
    title: "Honda Civic EXL 2021 — São Paulo/SP",
    description: "Honda Civic EXL 2021, 38.000km, CVT, cor branca, teto solar, couro bege, sensores de estacionamento. Revisões em dia na concessionária.",
    category: LotCategory.VEICULO,
    startPrice: 72000,
    minIncrement: 1000,
    appraisalValue: 105000,
    uf: "SP",
    cidade: "São Paulo",
    images: [p("v", 261), p("v", 280)],
  },
  {
    title: "Volkswagen Amarok V6 2020 — Porto Alegre/RS",
    description: "Volkswagen Amarok V6 Highline 2020, 4x4, 50.000km, cor preta, bancos de couro, teto panorâmico. Pickup de alto padrão com excelente estado.",
    category: LotCategory.VEICULO,
    startPrice: 145000,
    minIncrement: 2000,
    appraisalValue: 215000,
    uf: "RS",
    cidade: "Porto Alegre",
    images: [p("v", 305), p("v", 321)],
  },
  {
    title: "Mercedes-Benz Atego 1719 Truck 2019 — Goiânia/GO",
    description: "Caminhão Mercedes-Benz Atego 1719, 2019, baú refrigerado 8m, 120.000km, documentação em dia. Excelente para transporte de alimentos e medicamentos.",
    category: LotCategory.VEICULO,
    startPrice: 185000,
    minIncrement: 3000,
    appraisalValue: 280000,
    uf: "GO",
    cidade: "Goiânia",
    images: [p("v", 330), p("v", 342)],
  },
  // ── Máquinas ─────────────────────────────────────────────────────────────────
  {
    title: "Escavadeira Caterpillar 320D — Belo Horizonte/MG",
    description: "Escavadeira hidráulica Caterpillar 320D, 2017, 4.200 horas trabalhadas, acompanha concha e rompedor. Laudo técnico disponível. Ótimo estado geral.",
    category: LotCategory.MAQUINA,
    startPrice: 210000,
    minIncrement: 5000,
    appraisalValue: 292000,
    uf: "MG",
    cidade: "Belo Horizonte",
    images: [p("m", 390), p("m", 400), p("m", 414)],
  },
  {
    title: "Trator John Deere 6110J 2018 — Ribeirão Preto/SP",
    description: "Trator John Deere 6110J, 2018, 2.800 horas, cabine pressurizada, 4x4, transmissão Powrquad. Revisão realizada. Laudo disponível para inspeção.",
    category: LotCategory.MAQUINA,
    startPrice: 175000,
    minIncrement: 3000,
    appraisalValue: 248000,
    uf: "SP",
    cidade: "Ribeirão Preto",
    images: [p("m", 425), p("m", 433)],
  },
  {
    title: "Guindaste Liebherr LTM 1050 — Santos/SP",
    description: "Guindaste móvel Liebherr LTM 1050, 50 toneladas de capacidade, 2015, 8.500 horas. Inspeção anual em dia, todos os certificados válidos.",
    category: LotCategory.MAQUINA,
    startPrice: 480000,
    minIncrement: 10000,
    appraisalValue: 750000,
    uf: "SP",
    cidade: "Santos",
    images: [p("m", 450), p("m", 462)],
  },
  // ── Bens Diversos ────────────────────────────────────────────────────────────
  {
    title: "Lote de equipamentos de informática — São Paulo/SP",
    description: "Lote com 50 notebooks Dell Latitude 5520 i5 2021, 8GB RAM, 256GB SSD. Todos em funcionamento, testados. Certificado de origem fiscal incluso.",
    category: LotCategory.DIVERSOS,
    startPrice: 45000,
    minIncrement: 1000,
    appraisalValue: 75000,
    uf: "SP",
    cidade: "São Paulo",
    images: [p("d", 500), p("d", 513)],
  },
  {
    title: "Estoque de móveis planejados — Joinville/SC",
    description: "Estoque de móveis planejados: 12 cozinhas completas, 8 dormitórios e 5 home offices. Itens novos em embalagem original. Nota fiscal disponível.",
    category: LotCategory.DIVERSOS,
    startPrice: 28000,
    minIncrement: 500,
    appraisalValue: 52000,
    uf: "SC",
    cidade: "Joinville",
    images: [p("d", 524), p("d", 538)],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // ── Leiloeiro user ──────────────────────────────────────────────────────────
  const hashedPw = await bcrypt.hash("lanceup123", 12);

  const leiloeiro = await prisma.user.upsert({
    where: { email: "leiloeiro@ileilao.com" },
    update: {},
    create: {
      email: "leiloeiro@ileilao.com",
      name: "Carlos Eduardo Mendes",
      password: hashedPw,
      role: Role.LEILOEIRO,
      kycStatus: KycStatus.VERIFIED,
      emailVerified: true,
      tipoCadastro: "PF",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@ileilao.com" },
    update: {},
    create: {
      email: "admin@ileilao.com",
      name: "Admin iLeilão",
      password: hashedPw,
      role: Role.ADMIN,
      kycStatus: KycStatus.VERIFIED,
      emailVerified: true,
      tipoCadastro: "PF",
    },
  });

  console.log("✅ Users created:", leiloeiro.email, admin.email);

  // ── Auctions ────────────────────────────────────────────────────────────────
  const now = new Date();

  const auction1 = await prisma.auction.upsert({
    where: { id: "seed-auction-1" },
    update: {},
    create: {
      id: "seed-auction-1",
      title: "1º Leilão Extrajudicial de Imóveis Bancários — Itaú Unibanco",
      description: "Leilão extrajudicial de imóveis retomados por alienação fiduciária. Imóveis residenciais e comerciais em SP, RJ, PR, SC, CE e DF.",
      leiloeiroId: leiloeiro.id,
      status: AuctionStatus.UPCOMING,
      startsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // em 3 dias
      endsAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),  // em 10 dias
    },
  });

  const auction2 = await prisma.auction.upsert({
    where: { id: "seed-auction-2" },
    update: {},
    create: {
      id: "seed-auction-2",
      title: "Leilão Judicial TJSP — Veículos e Máquinas",
      description: "Leilão judicial de veículos e equipamentos apreendidos por determinação da 3ª Vara Cível de São Paulo.",
      leiloeiroId: leiloeiro.id,
      status: AuctionStatus.UPCOMING,
      startsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
    },
  });

  const auction3 = await prisma.auction.upsert({
    where: { id: "seed-auction-3" },
    update: {},
    create: {
      id: "seed-auction-3",
      title: "Leilão de Bens Empresariais — Massa Falida Tech Solutions Ltda",
      description: "Leilão de bens móveis e equipamentos de empresa em recuperação judicial. Informática, móveis, máquinas industriais.",
      leiloeiroId: leiloeiro.id,
      status: AuctionStatus.UPCOMING,
      startsAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Auctions created");

  // ── Lots ────────────────────────────────────────────────────────────────────
  const auctionMap: Record<LotCategory, string> = {
    IMOVEL: auction1.id,
    VEICULO: auction2.id,
    MAQUINA: auction2.id,
    DIVERSOS: auction3.id,
  };

  let lotCount = 0;
  for (const lotData of LOTS_DATA) {
    const existing = await prisma.lot.findFirst({
      where: { title: lotData.title, auctionId: auctionMap[lotData.category] },
    });
    if (existing) { lotCount++; continue; }

    await prisma.lot.create({
      data: {
        title: lotData.title,
        description: lotData.description,
        category: lotData.category,
        images: lotData.images,
        startPrice: lotData.startPrice,
        currentPrice: lotData.startPrice,
        minIncrement: lotData.minIncrement,
        appraisalValue: lotData.appraisalValue,
        status: LotStatus.PUBLISHED,
        auctionId: auctionMap[lotData.category],
        uf: lotData.uf,
        cidade: lotData.cidade,
      },
    });
    lotCount++;
  }

  console.log(`✅ ${LOTS_DATA.length} lots created/verified`);
  console.log("\n🎉 Seed complete!");
  console.log("\nTest accounts:");
  console.log("  Leiloeiro: leiloeiro@ileilao.com / lanceup123");
  console.log("  Admin:     admin@ileilao.com / lanceup123");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
