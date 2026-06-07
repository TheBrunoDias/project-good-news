# Daily Good News - Guia de Desenvolvimento

## Visão do Projeto
O Daily Good News é um agregador de notícias positivas. É um monorepo contendo um frontend em Next.js para exibição do feed e uma API serverless em Node.js/Fastify hospedada na AWS Lambda. O core business envolve buscar notícias via NewsAPI, avaliar a positividade (0-10) usando Google GenAI, e salvar as aprovadas (score >= 7) no PostgreSQL.

## Stack Tecnológica
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Backend:** Node.js, Fastify, AWS Lambda, Amazon EventBridge.
- **Banco de Dados:** PostgreSQL (Neon), Drizzle ORM.
- **Integrações:** NewsAPI, Google GenAI SDK.

## Estrutura do Monorepo
- `/apps/web`: Aplicação Next.js (Frontend).
- `/apps/api`: API Node.js com Fastify e lógica da AWS Lambda.
- `/packages/db`: Configuração do Drizzle ORM e schemas do banco de dados (compartilhado).

## Ferramentas de Monorepo e Infraestrutura
- **Gerenciador de Pacotes:** `npm`. Toda a gestão de dependências entre os pacotes deve utilizar o recurso de `npm workspaces`.
- **Monorepo:** Turborepo. Todo o gerenciamento de tarefas, cache e dependências locais deve passar pelo `turbo.json`.
- **Infraestrutura como Código (IaC):** SST (versão 3 / Ion). 
  - Toda a infraestrutura AWS (Lambdas, filas, banco Neon, Vercel/OpenNext) deve ser declarada exclusivamente no arquivo `sst.config.ts` na raiz do projeto.
  - O SST é a fonte da verdade para variáveis de ambiente. Use a injeção de recursos nativa do SST (`Resource.MinhaVariavel`) em vez de arquivos `.env` soltos sempre que for integrar serviços (ex: URL do banco entre a infra e a API).
  - Nunca crie arquivos do Serverless Framework (`serverless.yml`) ou AWS SAM. Use apenas SST.

## Padrões de Código e Regras Absolutas

### TypeScript
- Use `strict: true` em todos os `tsconfig.json`.
- Prefira `interface` em vez de `type`.
- Não use `any`. Tipagem estática rigorosa é obrigatória para os retornos da NewsAPI e do Google GenAI.

### Frontend (Next.js)
- Use Server Components por padrão. Adicione `"use client"` apenas quando houver interatividade real (hooks, eventos de clique).
- Estilização estritamente feita com Tailwind CSS. Não crie arquivos `.css` ou `.scss` separados (exceto o global).
- Consuma a API interna (Lambda) usando `fetch` com a estratégia de revalidação apropriada para o SSR do feed.

### Backend (Fastify / AWS Lambda)
- A Lambda principal é acionada por um cron job (EventBridge). Seu fluxo deve ser estrito:
  1. Fetch na NewsAPI.
  2. Normalização (title, description, url, image, date).
  3. Avaliação no Google GenAI.
  4. Filtro (apenas score >= 7).
  5. Inserção no banco com tratamento para ignorar duplicatas (URL unique constraint).
- Mantenha a inicialização do Fastify e do Drizzle fora do handler da Lambda para reaproveitar conexões no "warm start".
- Trate falhas de APIs externas de forma graciosa. Se o Google GenAI falhar ou atingir limite de taxa, logue o erro e encerre a execução sem derrubar a infraestrutura.

### Banco de Dados (Drizzle + Neon)
- Defina todas as tabelas no `/packages/db/schema.ts`.
- A tabela de notícias **deve** ter uma constraint `UNIQUE` na coluna da URL da notícia.
- Ao inserir dados aprovados, use `.onConflictDoNothing()` do Drizzle para garantir a idempotência da Lambda e evitar erros no log caso a NewsAPI retorne notícias repetidas nos dias seguintes.

## Cultura de Testes Obrigatória
- **Framework Padrão:** Use `vitest` para testes unitários e de integração em todo o monorepo.
- **Regra de Ouro:** NENHUMA nova funcionalidade, regra de negócio ou endpoint deve ser criado sem o seu respectivo teste automatizado acompanhando no mesmo passo.
- **Padrão de Arquivos:** Coloque os testes unitários ao lado do arquivo original (ex: `news-service.ts` e `news-service.test.ts`).
- **O que testar:** - Teste a lógica de domínio isoladamente (mockando APIs externas como NewsAPI e GenAI).
  - Teste a persistência no banco (Drizzle) garantindo que as constraints (como URL única) funcionam.
- Para o frontend (Next.js), crie testes de componentes focados em acessibilidade e estado usando React Testing Library + Vitest.

## Anti-padrões (NÃO FAÇA)
- Não crie componentes baseados em classes no React.
- Não misture a lógica da API de avaliação (GenAI) dentro dos Server Components do Next.js; essa responsabilidade é exclusiva da Lambda.
- Não faça commits de arquivos `.env`.