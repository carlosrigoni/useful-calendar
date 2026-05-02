Implemente X.
Antes de alterar, leia os arquivos relacionados.
Mantenha o comportamento atual.
Adicione ou atualize testes.
Rode pnpm typecheck, pnpm lint e pnpm test.
No final, explique quais arquivos mudou e por quê.
Crie a tela de login em Next.js App Router.

<!-- O agente trabalha melhor quando tem critério de aceitação. Exemplo bom: -->

Critérios:

- rota: /login
- formulário com email e senha
- validação com zod
- botão disabled durante submit
- mensagens de erro acessíveis
- layout responsivo mobile-first
- não usar any
- criar teste básico do formulário
- rodar pnpm typecheck e pnpm lint

<!-- Separe tarefas grandes em fases -->
<!-- Em vez de pedir:

Faça o sistema inteiro de autenticação, dashboard, permissões e banco.

Peça em etapas: -->

Fase 1: analise a estrutura e proponha plano.
Fase 2: crie schema e camada de autenticação.
Fase 3: implemente UI.
Fase 4: conecte server actions/API.
Fase 5: adicione testes.
Fase 6: revise segurança e edge cases.
