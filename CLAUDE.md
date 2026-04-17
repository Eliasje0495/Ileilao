# LanceUp — Contexto do Projeto

## Visão geral

LanceUp é uma plataforma brasileira de leilões online (extrajudicial e judicial) construída com Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, NextAuth, Stripe, Ably e Resend.

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript (strict mode) |
| Estilo | Tailwind CSS v4 |
| ORM | Prisma v7 — PostgreSQL |
| Auth | NextAuth v4 — JWT strategy |
| Pagamentos | Stripe (caução + liquidação) |
| Tempo real | Ably (WebSockets) |
| E-mail | Resend |
| Validação | Zod v4 |
| Senhas | bcryptjs |
| Criptografia | AES-256-GCM (lib/encrypt.ts) |

## Estrutura do projeto

```
lanceup/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   ├── lots/[id]/route.ts            # GET lot + bids
│   │   ├── lots/[id]/bid/route.ts        # POST place bid
│   │   └── ably/token/route.ts           # Ably token request
│   ├── page.tsx                          # Homepage (marketing)
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── prisma.ts                         # Singleton Prisma client
│   ├── auth.ts                           # NextAuth config
│   ├── encrypt.ts                        # AES-256-GCM encrypt/decrypt
│   └── bid-engine.ts                     # Core bidding logic
├── prisma/
│   └── schema.prisma                     # DB schema
└── .env.local                            # Environment variables (never commit)
```

## Modelos de dados

- **User** — compradores, vendedores, admins e leiloeiros; KYC status; CPF criptografado
- **Auction** — agrupa lotes, tem um leiloeiro responsável
- **Lot** — unidade leiloável; categoria, preço, status, vencedor
- **Bid** — cada lance; hash chain SHA-256 para auditoria imutável
- **Caucao** — depósito de garantia via Stripe; obrigatório para dar lances
- **Payment** — liquidação pós-arremate (PIX, cartão, boleto, TED)
- **Document** — edital, matrícula, laudo, ATA — com hash de integridade
- **KycDocument** — documentos enviados para verificação de identidade

## Regras de negócio críticas

### Lances
1. Usuário precisa ter KYC verificado (`kycStatus = VERIFIED`).
2. Usuário precisa ter caução com status `HELD` para o lote.
3. Lance mínimo = `max(currentPrice, startPrice) + minIncrement`.
4. Cada lance cria uma entrada no hash chain (SHA-256 do hash anterior + dados do lance).
5. A transação de lance usa `isolationLevel: Serializable` para evitar race conditions.
6. Após o lance ser persistido, publica no canal Ably `lot:{lotId}`.

### Caução
- Retida via Stripe PaymentIntent.
- Devolvida automaticamente para perdedores após encerramento.
- Forfeited se vencedor não concluir pagamento no prazo.

### KYC
- Usuário envia documentos (CPF, RG/CNH, comprovante de residência).
- Admin/sistema revisa e atualiza `kycStatus`.
- CPF armazenado criptografado (AES-256-GCM) no banco.

## Variáveis de ambiente necessárias

```
DATABASE_URL         # PostgreSQL connection string
DIRECT_URL           # Direct (non-pooled) PostgreSQL URL
NEXTAUTH_SECRET      # JWT secret
NEXTAUTH_URL         # Base URL da aplicação
STRIPE_SECRET_KEY    # Chave secreta Stripe
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ABLY_API_KEY         # Chave server-side Ably
NEXT_PUBLIC_ABLY_API_KEY
RESEND_API_KEY       # Para e-mails transacionais
ENCRYPTION_KEY       # 32 bytes hex (64 chars) para AES-256
```

## Comandos úteis

```bash
# Gerar cliente Prisma após alterar schema
npx prisma generate

# Criar/aplicar migrações
npx prisma migrate dev --name nome_da_migracao

# Abrir Prisma Studio
npx prisma studio

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Convenções de código

- Todos os arquivos em TypeScript strict.
- API routes usam `NextRequest` / `NextResponse`.
- Params de rotas dinâmicas são `Promise<{ id: string }>` (Next.js 15+ padrão).
- Erros de negócio retornam `{ error: string }` com código HTTP adequado.
- Nunca expor `password`, `cpf` raw, ou dados internos nas respostas de API.
- Usar `prisma.$transaction` com `isolationLevel: "Serializable"` para operações concorrentes críticas.

## Próximos passos de desenvolvimento

- [ ] Páginas de autenticação (`/auth/login`, `/auth/register`)
- [ ] Dashboard do comprador
- [ ] Dashboard do leiloeiro (criar auction/lot)
- [ ] Página do lote com lance ao vivo (Ably client)
- [ ] Fluxo de caução (Stripe PaymentIntent)
- [ ] Fluxo de KYC (upload de documentos)
- [ ] Webhooks Stripe para confirmar caução e pagamentos
- [ ] E-mails transacionais via Resend (confirmação, arrematado, documentos)
- [ ] Painel admin
- [ ] App mobile (React Native / Expo)
