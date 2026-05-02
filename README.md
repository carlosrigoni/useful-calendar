# Life Calendar

Aplicacao pessoal em Next.js para organizar o mes em torno de um calendario com suporte a aniversarios, feriados e movimentacoes financeiras.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL via Docker Compose
- pnpm

## Escopo atual

O MVP e focado em:

- calendario mensal em `/`
- navegacao por mes com `year` e `month`
- pagina de detalhe em `/day/YYYY-MM-DD`
- itens normalizados de calendario derivados do banco
- filtros por tipo de item
- resumos financeiros mensais
- graficos de gastos por categoria e entradas vs saidas

Dados sao inseridos manualmente via banco ou Prisma Studio. O projeto nao inclui autenticacao, CRUDs, APIs publicas nem integracoes externas nesta fase.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Banco de dados

```bash
pnpm db:up
pnpm db:down
pnpm db:logs
pnpm prisma:generate
pnpm prisma:migrate -- --name <migration_name>
pnpm prisma:deploy
pnpm prisma:studio
```

Os arquivos principais do banco estao em:

- `prisma/schema.prisma`
- `prisma/migrations`
- `lib/prisma.ts`

## Referencias

- Regras do agente: `AGENTS.md`
- Produto: `docs/product.md`
- Arquitetura: `docs/architecture.md`
- Banco e Prisma: `docs/database.md`
