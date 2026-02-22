# Relatório de Revisão Técnica e Melhorias

## 1) Escopo e metodologia

Este relatório cobre revisão de:
- Fluxo de navegação e autorização
- Padrões visuais e consistência de UI
- Qualidade de código e robustez de integração cliente/API

Validações executadas:
- `npm run lint` (falhou com 3 erros e 50 warnings)
- `npm run build` (falhou por fetch de fonte Google em ambiente sem rede)
- Revisão manual de rotas, layouts, serviços, componentes de tabela, autenticação e módulos críticos

## 2) Resumo executivo

Estado atual: há inconsistências relevantes de fluxo e autorização, além de problemas de qualidade que impactam estabilidade e manutenção.

Principais riscos:
- Regras de acesso incompletas/inconsistentes no proxy
- Pontos de fluxo quebrados (rotas públicas e links de autenticação)
- Falha de build em ambiente offline/CI por fonte remota
- Erros de lint bloqueando baseline de qualidade
- Inconsistências visuais (tokens de cor e linguagem da interface)

## 3) Achados por severidade

## Críticos

1. **Rota pública de pré-cadastro não está mapeada corretamente no proxy**
- Evidência: `src/proxy.ts:21` libera `^/condominios/[^/]+/form$`, mas as rotas reais são `pre-cadastro` e `pre-cadastro-sucesso` (`src/app/condominios/[condId]/(public)/pre-cadastro/page.tsx:1`, `src/app/condominios/[condId]/(public)/pre-cadastro-sucesso/page.tsx:1`).
- Impacto: usuários não autenticados podem ser redirecionados para login em fluxo público.

2. **Regra de autorização para admin está incorreta para estrutura de rotas atual**
- Evidência: `src/proxy.ts:57` usa `path.startsWith('/admin')`, porém URLs reais estão em `/condominios/:condId/...`.
- Impacto: páginas administrativas podem ficar sem bloqueio efetivo por role em acesso direto por URL.

3. **API inteira está fora do matcher do proxy (sem controle de sessão/role no gateway)**
- Evidência: `src/proxy.ts:82` exclui `/api` no matcher.
- Impacto: endpoints de CRUD podem ficar acessíveis sem camada central de autorização.

## Altos

1. **Página de fallback pós-redirecionamento pode ficar em branco**
- Evidência: redirecionamento de acesso negado vai para `/condominios/${condId}` (`src/proxy.ts:71`), mas a página correspondente retorna vazio (`src/app/condominios/[condId]/(admin)/page.tsx:2`).
- Impacto: fluxo quebrado e experiência inconsistente.

2. **Build falha em ambiente sem acesso à internet por dependência de fonte remota**
- Evidência: `src/app/layout.tsx:2` usa `next/font/google` (`Inter`), e o build falhou ao buscar `fonts.googleapis.com`.
- Impacto: pipeline/ambientes restritos não conseguem gerar build.

3. **Serialização de payload inconsistente no módulo de usuários (double stringify)**
- Evidência: `src/features/usuarios/services/users.service.ts:54`, `src/features/usuarios/services/users.service.ts:67`, `src/features/usuarios/services/users.service.ts:78` usam `JSON.stringify(...)` antes de `apiRequest`, que já serializa em `src/lib/api-client.ts:22`.
- Sinal secundário de workaround: `src/app/api/condominios/[condId]/usuarios/[id]/route.ts:188` precisa fazer `typeof body === 'string' ? JSON.parse(body) : body`.
- Impacto: contrato frágil entre cliente e API, risco de bugs de atualização.

4. **PATCH de condômino ignora condomínio e não valida índice inexistente**
- Evidência: `condId` não utilizado em `src/app/api/condominios/[condId]/condominos/[id]/route.ts:98`; busca por índice não filtra por condomínio em `src/app/api/condominios/[condId]/condominos/[id]/route.ts:108`; retorno 200 mesmo em caso inválido em `src/app/api/condominios/[condId]/condominos/[id]/route.ts:123`.
- Impacto: possível atualização de registro fora de contexto e retorno inconsistente.

5. **Bug de mapeamento de placeholders no fluxo de contrato por modelo**
- Evidência: em `src/features/contratos/components/add-contratos.tsx:402` já existe retorno para `locatario.nome`, tornando a regra de banco em `src/features/contratos/components/add-contratos.tsx:413` inatingível.
- Impacto: placeholders de dados bancários podem ser preenchidos incorretamente.

6. **Links de navegação quebrados em telas de autenticação**
- Evidência: links apontam para `/login` em vez de `/auth/login` em `src/features/components/auth/ForgotPasswordForm.tsx:61`, `src/features/components/auth/RecoverPasswordForm.tsx:98`, `src/features/components/auth/SignupForm.tsx:112`.
- Impacto: usuário cai em rota inexistente no retorno para login.

7. **Baseline de qualidade quebrada (lint com erros bloqueantes)**
- Evidência principal:
  - `src/features/components/auth/RoleGuard.tsx:23` (`setState` dentro de `useEffect`)
  - `src/features/condominos/components/ViewDialog/Section.tsx:13` (`any`)
  - `src/features/despesas/components/view-despesa-dialog.tsx:50` (`any`)
- Impacto: fragilidade técnica e regressões mais difíceis de conter.

## Médios

1. **Variáveis CSS inconsistentes entre definição e uso**
- Evidência: definidos `--color-brand-*` em `src/app/globals.css:7`, mas uso de `var(--brand-dark)` e `var(--brand-red-vivid)` em `src/app/globals.css:165`, `src/app/globals.css:250`.
- Impacto: risco de cor não aplicada/estilo inconsistente.

2. **Inconsistência de fluxo ao trocar condomínio**
- Evidência: uma tela redireciona para `/usuarios` (`src/app/condominios/page.tsx:139`) e outra para `/dashboard` (`src/features/components/condominium-switcher.tsx:160`).
- Impacto: comportamento imprevisível para mesma ação.

3. **Uso excessivo de logs de debug em produção (incluindo contexto sensível)**
- Evidência: `src/proxy.ts:15`, `src/proxy.ts:16`, `src/features/components/app-sidebar.tsx:71` e diversos endpoints `api/*`.
- Impacto: ruído de observabilidade, risco de exposição indevida de dados em logs.

4. **Componente de sucesso órfão sem uso**
- Evidência: `src/app/condominios/[condId]/(public)/pre-cadastro-sucesso/FormSuccess.tsx:6` não é referenciado em nenhum outro arquivo.
- Impacto: manutenção confusa e código morto.

5. **React Query configurado, mas não integrado na árvore**
- Evidência: `src/lib/react-query.ts:4` define `QueryClient`, porém `src/app/providers.tsx:7` não usa `QueryClientProvider`.
- Impacto: dependência e setup sem uso real.

6. **`DataTableToolbar` com dependência de efeito complexa e warning de sincronização**
- Evidência: `src/features/components/data-table/data-table-toolbar.tsx:51`.
- Impacto: risco de comportamento imprevisível no filtro de busca.

7. **Inconsistência de linguagem na interface (PT/EN)**
- Evidência: `Log out` e `Add Condomínio` em `src/features/components/app-sidebar.tsx:262`, `src/features/components/condominium-switcher.tsx:243`; `Open menu` em `src/features/contratos/components/data-table-row-actions.tsx:74`.
- Impacto: UX menos coesa.

8. **Preview de modelo com `dangerouslySetInnerHTML` sem sanitização explícita**
- Evidência: `src/features/modelos-contrato/components/add-modelo-contrato.tsx:190`.
- Impacto: risco de XSS se conteúdo vier de origem não confiável.

9. **Configuração de placeholders duplicada/ambígua no editor de modelo**
- Evidência: grupos `imovel` repetidos em `src/features/modelos-contrato/components/rich-text-editor.tsx:42` e `src/features/modelos-contrato/components/rich-text-editor.tsx:103`; chaves `nome` duplicadas para diferentes significados em `src/features/modelos-contrato/components/rich-text-editor.tsx:64` e `src/features/modelos-contrato/components/rich-text-editor.tsx:75`.
- Impacto: risco de erro semântico na criação de modelos.

## Baixos

1. **Controle visual sem efeito funcional**
- Evidência: botão `Recarregar Preview` sem ação útil em `src/features/modelos-contrato/components/add-modelo-contrato.tsx:192`.

2. **Texto/label inconsistente no fluxo de segundo proponente**
- Evidência: label `Selecionar Condomínio` para seleção de condômino em `src/features/contratos/components/add-contratos.tsx:1408`.

3. **Ação de cancelar sem implementação no pré-cadastro**
- Evidência: `onClick={() => {}}` em `src/app/condominios/[condId]/(public)/pre-cadastro/page.tsx:297`.

4. **Resíduos de desenvolvimento e naming inconsistente**
- Evidência: comentário solto em `src/app/condominios/[condId]/(public)/pre-cadastro/page.tsx:229`; arquivo com typo `src/features/form/components/AdditionalResidentsSecton.tsx:1`; utilitário importado e não usado em `src/app/condominios/[condId]/(admin)/condominos/page.tsx:1`.

## 4) Inconsistências visuais e de padrão

1. **Sistema de cores híbrido e pouco previsível**
- Mistura de tokens de tema (`primary`, `muted`) com classes hardcoded (`bg-blue-600`, `text-gray-*`) e tokens de marca (`text-brand-dark`) em várias telas.
- Recomendação: consolidar padrão em design tokens e eliminar cores hardcoded fora de casos justificados.

2. **Padrão de idioma misto na interface**
- Labels de navegação e ação misturam português e inglês.
- Recomendação: padronizar locale `pt-BR` em todo texto de UI.

3. **Estilo de código inconsistente**
- Arquivos com estilos distintos (aspas simples vs duplas, com/sem ponto e vírgula, indentação divergente).
- Recomendação: aplicar Prettier/ESLint fix e regras obrigatórias no CI.

## 5) Melhorias recomendadas (priorizadas)

## Prioridade P0 (imediata)

1. Corrigir regras de `proxy` para:
- liberar explicitamente `/condominios/:condId/pre-cadastro` e `/condominios/:condId/pre-cadastro-sucesso`
- ajustar regra admin para rotas reais (`/condominios/:condId/usuarios`, etc.)
- definir estratégia de proteção para `/api` (matcher + validação por endpoint)

2. Corrigir rota de fallback de acesso negado para uma página existente e funcional (ex.: dashboard).

3. Corrigir serialização do módulo de usuários removendo `JSON.stringify` antes de `apiRequest`.

4. Corrigir bugs de mapeamento de placeholders de contrato (`locatario.nome` vs banco) e chaves ambíguas no editor.

5. Fazer lint voltar ao verde (3 erros bloqueantes).

## Prioridade P1

1. Trocar fonte para estratégia resiliente offline:
- usar fonte local (`next/font/local`) ou pacote local já instalado (`@fontsource/inter`)

2. Corrigir variáveis CSS (`var(--brand-*)` para nomes consistentes com tokens definidos).

3. Padronizar links de autenticação para `/auth/login`.

4. Remover logs de debug do cliente/proxy e de rotas mock.

## Prioridade P2

1. Integrar ou remover React Query para reduzir drift arquitetural.

2. Unificar parsing de filtros com utilitário comum e remover código duplicado.

3. Limpar código morto (`FormSuccess`) e pequenas inconsistências de nomenclatura/texto.

4. Revisar UX de ações sem efeito (ex.: botão de preview) e de labels incorretos.

## 6) Plano de execução sugerido

1. **Segurança e fluxo**: proxy, roles, fallbacks, rotas públicas e proteção de API.
2. **Confiabilidade**: build/fontes, lint errors, contrato de payload nos serviços.
3. **Domínio de contratos/modelos**: placeholders e consistência semântica.
4. **Padrão visual e manutenção**: tokens, idioma, logs, limpeza de código.

## 7) Riscos residuais e lacunas

- Não há script de testes automatizados (`test`) no `package.json`, o que limita validação regressiva após correções.
- Parte da API é mock/in-memory; recomenda-se repetir a revisão com backend real para validar contratos finais.

