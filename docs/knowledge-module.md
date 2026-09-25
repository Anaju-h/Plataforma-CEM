# Módulo de Gestão do Conhecimento em Orçamentação

Área interna (`/portal/conhecimento`), atrás de login, que fecha o ciclo **orçar → executar → comparar → aprender → recomendar**. Nenhum valor, margem ou lição aparece nas páginas públicas nem na área do cliente.

## Mapeamento das telas no ciclo (Vallejos, 2005)

| Fase | Peça do módulo | Tela | Backend |
| --- | --- | --- | --- |
| Criar | Registro de Serviço (blocos A, B, C) e lição aprendida | `Registros de Serviço`, detalhe `REG-XXXX` | `RecordService` |
| Organizar | Vocabulário controlado e classificação de sigilo | `Vocabulário controlado` | `VocabularyService`, `km_term` |
| Formalizar | Validação: só conhecimento conferido alimenta recomendação | `Lições e validação` | `LessonService.decide/supersede` |
| Disseminar | Aviso automático a quem assina o assunto | `Avisos e assinaturas` | `LessonService.disseminate`, `km_notice` |
| Aplicar | Assistente de Orçamento | `Assistente de Orçamento` (também a partir do ORC) | `AssistantService` |
| Evoluir | Indicadores e recálculo do fator ao longo do tempo | `Indicadores` (curva do fator por caso) | `IndicatorService` |

## Perfis

| Perfil | Pode |
| --- | --- |
| Consulta | Ver registros públicos, indicadores e usar o Assistente. Não edita nada. |
| Técnico | + criar registros (bloco A), fechar serviços (B e C) e enviar lições para validação. |
| Validador | + formalizar/devolver lições e marcar conhecimento como superado; vê itens restritos. |
| Administrador | + usuários, vocabulário e tolerância. |

Registros e lições são **interno público** (todos os perfis) ou **restrito** (Validador e Administrador). Itens restritos não aparecem nem entram nos cálculos para quem não pode vê-los.
A autorização é feita no backend (políticas HTTP por método + verificação de perfil nos serviços). A sessão é JWT assinado em cookie HttpOnly/SameSite=Strict.

## Regras de negócio

1. **Registro não fecha sem B e C.** O fechamento exige esforço real, data de entrega, retrabalho, mudança de escopo, ao menos uma causa de desvio e uma lição. Há também um `CHECK` no banco para o bloco B.
2. **PRJ não conclui sem registro fechado.** `ProjectService` recusa a conclusão se não houver Registro de Serviço fechado para o ORC do projeto (`lab.knowledge.require-record-on-project-completion`).
3. **Classificação só pelo vocabulário.** Tipo de serviço, características da peça, recursos e causas são termos de `km_term`; termos não são apagados, apenas desativados.
4. **O Assistente sugere, não decide.** Se a estimativa sair da faixa provável (Q1–Q3), o registro exige justificativa, que fica gravada junto com o retrato da recomendação (casos usados, faixa, fator).
5. **Só conhecimento formalizado alimenta recomendações.** Um caso entra no Assistente quando o registro está fechado **e** sua lição foi formalizada por um Validador. Casos aguardando validação e casos superados aparecem como “fora do cálculo”.

## Assistente — escada de confiança

Caso parecido = mesmo **tipo de serviço** e mesmo **porte**. Material, complexidade, quantidade de características e GD&T ordenam os casos (semelhança x/4).

| Casos | Comportamento |
| --- | --- |
| 0 | Não inventa faixa. Mostra o roteiro de estimativa do tipo de serviço. Confiança: sem histórico. |
| 1–4 | Casos um a um, sem faixa e sem fator. Confiança baixa. |
| 5–14 | Faixa provável = 1º quartil a 3º quartil das horas realizadas, mediana no centro. Confiança média. |
| 15+ | Faixa + fator de correção = mediana de (realizado ÷ orçado). Confiança alta. |

Sempre é possível abrir a lista dos casos que geraram o número (sem caixa-preta). Mediana e quartis usam interpolação linear (tipo 7), porque com poucos casos um atípico distorceria a média.

## Indicadores

Por registro: desvio de esforço, custo e prazo = (realizado − orçado) ÷ orçado; margem orçada e realizada = (valor − custo) ÷ valor.
Por tipo de serviço: índice de assertividade (dentro de ±tolerância, padrão 15%, configurável), faixa (mediana e quartis), fator de correção, evolução do fator a cada caso e causas mais frequentes.
Os indicadores usam somente o histórico real do laboratório. Registros de demonstração aparecem num bloco separado, com a etiqueta DEMO, e nunca entram nesses números (coberto por `KnowledgeRulesTest` e `KnowledgeCycleTest`).

## Vocabulário controlado (versão inicial)

| Classe | Termos | Decisões de nomenclatura |
| --- | --- | --- |
| Tipo de serviço | Medição dimensional em MMC; Digitalização 3D; Engenharia reversa; Inspeção por tomografia/raio-X; Inspeção de primeira peça; Calibração; Elaboração de laudo; Análise de falhas (incluído pelo Administrador) | Nome do serviço como o laboratório o vende; cada tipo tem um roteiro de estimativa. |
| Material | Aço; Alumínio; Ferro fundido; Polímero; Compósito; Outro | Famílias amplas; subdividir só quando o histórico mostrar diferença. |
| Porte | Pequeno (≤100 mm); Médio (100–500 mm); Grande (500–1500 mm); Muito grande (>1500 mm) | Pela maior dimensão, para evitar “peça grande” × “peça de grande porte”. |
| Complexidade geométrica | Baixa; Média; Alta | Definições curtas no próprio termo. |
| Quantidade de características | Até 20; 21 a 100; Mais de 100 | Faixas em vez de número livre, para os casos se somarem. |
| GD&T | Sem GD&T; Com GD&T | Binário na primeira versão. |
| Recurso | ZEISS PRISMO; DuraMax; O-INSPECT; ATOS Q; T-SCAN; BOSELLO MAX; Software ZEISS CALYPSO; Software ZEISS INSPECT; Sala climatizada; Dispositivo de fixação dedicado | Equipamentos locais de Goiânia (CONTURA fica fora). |
| Causa de desvio | Fixação mais complexa que o previsto; Programação subestimada; Retrabalho por não conformidade; Mudança de escopo pelo cliente; Espera por informação do cliente; Preparação de superfície não prevista; Sem desvio relevante | “Sem desvio relevante” existe para que serviços no alvo também sejam registrados. |

A lista deve ser revisada e ampliada com o laboratório pela própria tela (perfil Administrador).

## Histórico real

- Os serviços reais do laboratório não têm etiqueta. Dados de demonstração (fictícios) aparecem com a etiqueta **DEMO**, entram no Assistente sinalizados e são removidos em Administração → Dados de demonstração.
- Cada orçamento real gera um Registro de Serviço (bloco A) vinculado ao ORC. O cliente é identificado por código (`CLI-…`), nunca pelo nome.
- Premissa da carga inicial: horas orçadas = valor da proposta ÷ R$ 150/h (registrada no campo de premissas de cada registro).
- As horas apontadas nas tarefas do PRJ preenchem automaticamente o esforço real ao fechar o registro.
- Os registros ficam **abertos** até o laboratório informar o realizado (bloco B) e o aprendizado (bloco C). Só então o PRJ pode ser concluído e o caso passa a alimentar o Assistente e os indicadores.

## Roteiro de apresentação (seção 7 do complemento)

1. **Entrar como Técnico** (`tecnico@lab.local`, senha `Lab@2026`) → *Assistente*: escolher tipo de serviço e porte. Com poucos casos formalizados, o Assistente mostra a confiança baixa e o roteiro de estimativa, sem inventar faixa.
2. **Registros**: abrir o registro de um PRJ em andamento e mostrar o bloco A (orçado, premissas, ORC vinculado).
3. **Fechar um registro** com o realizado do laboratório (horas, entrega, retrabalho, causa de desvio) e a lição → enviar para validação.
4. **Entrar como Validador** (`validador@lab.local`) → *Lições e validação* → **Formalizar**. Quem assina o assunto recebe o aviso.
5. **Assistente de novo**: o caso formalizado entra na recomendação; *Indicadores* mostram desvio e assertividade.
6. **Projetos**: o PRJ correspondente agora pode ser concluído (a regra exige o registro fechado).

## Testes automatizados

- `StatsTest` e `KnowledgeRulesTest` (sem banco): mediana e quartis, escada de confiança, tolerância, indicadores por tipo e separação da demonstração.
- `KnowledgeCycleTest` (API + banco de teste): executa o roteiro acima de ponta a ponta. Cobre o Assistente sem histórico, os blocos A → B + C, a formalização só pelo Validador, o aviso a quem assina, a recomendação que muda, a faixa com justificativa obrigatória, a demonstração apagada sem afetar o real e os valores comerciais ocultos.

A semente real (pessoas consultadas e serviços recuperados) está em [`semente-real.md`](semente-real.md).
