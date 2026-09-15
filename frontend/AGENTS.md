# Projeto Lab ZEISS — Regras para Codex

## Stack
- React 19
- JavaScript / JSX
- Vite
- Tailwind CSS
- motion/react
- react-router-dom
- Yarn
- Não introduzir TypeScript.
- Não converter o projeto para Next.js.

## Estrutura
- Frontend atual: /frontend
- Código antigo fora de /frontend não deve ser usado como referência.
- Área pública: /
- Área cliente: /cliente
- Área interna: /portal

## Regras de implementação
- Antes de alterar um service, localizar todos os consumidores e preservar compatibilidade.
- Não criar implementações temporárias quando a estrutura definitiva já estiver definida.
- Não duplicar regras de negócio em páginas diferentes.
- Preferir services/utilitários compartilhados.
- Após alterações relevantes, executar build e lint.
- Não alterar arquivos não relacionados sem necessidade.

## Segurança
- Não armazenar JWT em localStorage ou sessionStorage.
- Autorização real será responsabilidade do backend.
- Não fingir autenticação real no frontend.
- Nunca expor custos internos, margem, fórmulas internas ou observações internas na área do cliente.

## Dados demo
- Dados demo e dados reais devem permanecer identificáveis e separados.
- Dados demo nunca devem alimentar indicadores reais de Gestão do Conhecimento.

## Fluxo operacional
SOL → ORC → PRJ → Registro de Serviço → Gestão do Conhecimento

## Orçamentos
- Todo ORC nasce de uma SOL apta.
- ORC contém dados vivos de elaboração.
- Propostas comerciais são documentos separados.

## Proposal Builder
- Propostas têm versionamento próprio.
- ORC não recebe versionamento documental.
- Uma versão gerada é imutável.
- Nova versão só pode surgir por ação explícita do usuário.
- V1 gerada permanece somente leitura.
- V2 deve nascer como cópia editável da última versão.
- Apenas versões publicadas aparecem ao cliente.
- A versão aceita deve ficar vinculada ao projeto.
- Logotipos da proposta: Centro de Excelência + SENAI.
- Identidade visual do documento é fixa.
- Usuário escolhe quais seções comerciais entram no documento.
- Custo interno, margem, justificativas internas e conhecimento interno nunca entram na proposta.

## Gestão do Conhecimento
- Ciclo: Criar → Organizar → Formalizar → Disseminar → Aplicar → Evoluir.
- Recomendações devem ser explicáveis.
- Não inventar histórico quando não existe.
- Somente conhecimento formalizado pode influenciar recomendações.
- Motor de recomendação não deve ser apresentado como IA de caixa-preta.