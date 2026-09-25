# Registro da semente real

Entregável da seção 8 do complemento: quem foi consultado, o que foi levantado e quais serviços reais formaram a base inicial. É a comprovação de que o histórico real nasceu de informação verdadeira do laboratório, não de números inventados.

## Pessoas consultadas

| Pessoa | Função | O que foi levantado | Onde foi usado |
| --- | --- | --- | --- |
| Matheus de Oliveira e Silva | Coordenador do laboratório | Como o laboratório orça hoje; horário de funcionamento; e-mail e canais de contato; modelo de solicitação; propostas comerciais reais já emitidas pelo laboratório | Formulário de solicitação e Configurador; rodapé e contato; fluxo SOL → ORC → proposta; carga dos serviços reais |
| Prof. Dr. Rolando Vargas Vallejos | Precursor do Centro de Excelência SENAI ZEISS | Depoimento sobre a origem e os objetivos do Centro (cultura de metrologia de precisão na região, formação e parceria com a Carl Zeiss) | Página Sobre: Quem somos, Missão, Visão, Trajetória e Memória do Centro |

## Serviços reais recuperados

As propostas comerciais reais cedidas pela coordenação foram cadastradas no sistema em execução, no fluxo completo SOL → ORC → proposta → PRJ, e cada uma gerou um Registro de Serviço (bloco A) no módulo de conhecimento.

| Tipo de serviço (vocabulário) | Serviços |
| --- | --- |
| Medição dimensional em MMC | 4 |
| Engenharia reversa | 2 |
| Análise de falhas | 2 |
| Digitalização 3D | 1 |
| **Total** | **9** |

## O que não vai para o repositório

Seguindo a seção 5 do complemento ("dado real, sim; dado sensível no repositório, não"):

- a identificação dos clientes e os valores praticados ficam só no banco do sistema em execução. Nos registros, o cliente aparece por um código (`CLI-…`);
- o script de carga (`private-data/seed-real-services.js`) e a planilha de custos por hora de máquina ficam em `private-data/`, que está no `.gitignore`;
- o repositório versiona apenas o código e o conjunto de demonstração (marcado DEMO e apagável com uma ação).

## Premissa das horas orçadas

As propostas reais informam serviço, escopo e valor, mas não as horas estimadas. Para registrar o bloco A sem inventar horas, foi adotada uma premissa explícita, gravada no campo **Premissas** de cada registro:

> horas orçadas = valor da proposta ÷ R$ 150/h (valor/hora de referência)

Essa premissa existe para demonstrar o mecanismo. Os blocos B (realizado) e C (aprendizado) desses registros **ficam abertos** até o laboratório informar o esforço real, a entrega e as causas de desvio. Só então os casos passam a alimentar o Assistente e os indicadores. Quando o laboratório assumir o sistema, as horas estimadas podem ser corrigidas por quem orçou cada serviço.
