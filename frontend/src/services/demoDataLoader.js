/*
 * Dados de DEMONSTRAÇÃO (fictícios), marcados em todo o sistema com a etiqueta DEMO.
 * Criados pelas mesmas APIs e regras da operação real (SOL → ORC → proposta → PRJ → tarefas → horas → Registro de Serviço → lição),
 * para demonstrar o ciclo completo sem tocar nos dados reais. Remoção: Administração → Dados de demonstração.
 */
const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const RATE = 150;

async function call(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method, credentials: "include",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(`${data?.message || "Falha"} (${method} ${path})`);
  return data;
}

function isoDaysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const NEEDS = { dimensional: "check-piece", scan: "physical-to-3d", "reverse-engineering": "reproduce-piece", "failure-analysis": "failure-analysis" };
const SERVICE_TYPES = { dimensional: "Medição dimensional em MMC", scan: "Digitalização 3D", "reverse-engineering": "Engenharia reversa" };

/* Projetos demo: cada tarefa = [título, perfil, horas planejadas, status, prazo (dias a partir de hoje), apontamentos [[dias atrás, horas, nota]]]. */
const PROJECTS = [
  {
    key: "horizonte", company: "Metalúrgica Horizonte Ltda", contact: "Coordenação da Qualidade", email: "qualidade@horizonte.example", phone: "(62) 3000-1001",
    service: "dimensional", machine: "prismo", equipment: "ZEISS PRISMO", piece: { name: "Flange de aço usinado", quantity: 4, material: "Aço", dimensions: "240 × 240 × 35 mm" },
    objective: "Relatório dimensional completo de 4 flanges com GD&T (planicidade e posição de furos).", budget: 12, deadlineDays: 10,
    km: { client: "CLI-D01", size: "Médio", material: "Aço", complexity: "Média", features: "21 a 100 características", gdt: "Com GD&T", resources: ["ZEISS PRISMO", "Software ZEISS CALYPSO", "Sala climatizada"] },
    tasks: [
      ["Conferir desenho, revisão e requisitos", "VALIDADOR", 1, "DONE", -12, [[13, 1, "Desenho rev. C conferido com o cliente"]]],
      ["Preparar fixação e estratégia de medição", "TECNICO", 2, "DONE", -10, [[11, 2.5, "Fixação improvisada; flange fina vibrava"]]],
      ["Programar e medir as 4 peças no CALYPSO", "TECNICO", 6, "DONE", -7, [[9, 4, "Programação CNC"], [8, 3.5, "Medição das 4 peças"]]],
      ["Analisar resultados e fora de tolerância", "TECNICO", 2, "DONE", -5, [[6, 2, "2 cotas fora em uma peça"]]],
      ["Revisar e emitir relatório", "VALIDADOR", 1, "DONE", -4, [[5, 1, "Relatório revisado e emitido"]]],
    ],
    finish: { closeRecord: true, formalize: true, complete: true, rework: false, scopeChange: false, cause: "Fixação mais complexa que o previsto",
      lesson: ["Flanges finas: prever fixação dedicada", "Em flanges com espessura abaixo de 40 mm a peça vibra na fixação padrão. Prever 1 h extra para fixação dedicada e registrar a premissa no orçamento."] },
    status: ["start", "review", "complete"],
  },
  {
    key: "cerrado", company: "Usinagem Cerrado Ltda", contact: "Engenharia de Produto", email: "engenharia@cerrado.example", phone: "(62) 3000-1002",
    service: "scan", machine: "atos-q", equipment: "ZEISS ATOS Q", piece: { name: "Carcaça de alumínio", quantity: 1, material: "Alumínio", dimensions: "320 × 180 × 120 mm" },
    objective: "Digitalização 3D da carcaça e comparação com o CAD (mapa de cores).", budget: 10, deadlineDays: 7,
    km: { client: "CLI-D02", size: "Médio", material: "Alumínio", complexity: "Alta", features: "21 a 100 características", gdt: "Sem GD&T", resources: ["ZEISS ATOS Q", "Software ZEISS INSPECT"] },
    tasks: [
      ["Conferir CAD e requisitos do cliente", "VALIDADOR", 1, "DONE", -6, [[7, 1, "CAD recebido em STEP"]]],
      ["Preparar superfície e marcadores", "TECNICO", 1.5, "DONE", -5, [[6, 2, "Spray matificante: peça muito brilhante"]]],
      ["Digitalizar com ATOS Q", "TECNICO", 5, "DONE", -4, [[5, 3.5, "Posições 1 a 20"], [4, 3, "Posições 21 a 34 e alinhamento"]]],
      ["Comparar com CAD e gerar mapa de cores", "TECNICO", 1.5, "DONE", -3, [[3, 1.5, "Relatório de comparação"]]],
      ["Revisar e preparar entrega", "VALIDADOR", 1, "DONE", -2, [[2, 1, "Entrega pronta para revisão"]]],
    ],
    finish: { closeRecord: true, formalize: false, complete: false, rework: false, scopeChange: false, cause: "Preparação de superfície não prevista",
      lesson: ["Alumínio usinado brilhante exige spray matificante", "Peças de alumínio com acabamento usinado refletem a luz do ATOS Q. Incluir preparação de superfície (≈ 0,5 h) e limpeza no orçamento."] },
    status: ["start", "review"],
  },
  {
    key: "araguaia", company: "Plásticos Araguaia S.A.", contact: "Ferramentaria", email: "ferramentaria@araguaia.example", phone: "(62) 3000-1003",
    service: "reverse-engineering", machine: "t-scan", equipment: "ZEISS T-SCAN", piece: { name: "Molde de para-choque (cavidade)", quantity: 1, material: "Aço", dimensions: "1.200 × 450 × 380 mm" },
    objective: "Engenharia reversa da cavidade do molde com entrega em STEP paramétrico.", budget: 30, deadlineDays: 20,
    km: { client: "CLI-D03", size: "Grande", material: "Aço", complexity: "Alta", resources: ["ZEISS T-SCAN", "Software ZEISS INSPECT"] },
    tasks: [
      ["Conferir escopo e nível de detalhe do CAD", "VALIDADOR", 2, "DONE", -5, [[6, 2, "Paramétrico nas superfícies funcionais"]]],
      ["Escanear o molde com T-SCAN", "TECNICO", 6, "DONE", -3, [[4, 3.5, "Lado A"], [3, 3, "Lado B e marcadores"]]],
      ["Modelar CAD paramétrico", "TECNICO", 16, "DOING", 3, [[2, 4, "Superfícies principais"], [1, 4, "Nervuras e raios"]]],
      ["Validar o modelo com o cliente", "VALIDADOR", 4, "TODO", 7, []],
      ["Preparar entrega (STEP + PDF)", "TECNICO", 2, "TODO", 9, []],
    ],
    finish: null,
    status: ["start"],
  },
  {
    key: "planalto", company: "Automotiva Planalto Ltda", contact: "Qualidade de Fornecedores", email: "sqa@planalto.example", phone: "(62) 3000-1004",
    service: "dimensional", machine: "duramax", equipment: "ZEISS DuraMax", piece: { name: "Suporte de freio", quantity: 2, material: "Ferro fundido", dimensions: "95 × 60 × 40 mm" },
    objective: "Inspeção dimensional de 2 suportes para aprovação de amostra (PPAP).", budget: 4, deadlineDays: 7,
    km: { client: "CLI-D04", size: "Pequeno", material: "Ferro fundido", complexity: "Baixa", features: "Até 20 características", gdt: "Sem GD&T", resources: ["ZEISS DuraMax", "Software ZEISS CALYPSO"] },
    tasks: [
      ["Conferir desenho e balonamento", "VALIDADOR", 0.5, "TODO", -1, []],
      ["Programar medição no CALYPSO", "TECNICO", 1.5, "TODO", 2, []],
      ["Medir os 2 suportes", "TECNICO", 1, "TODO", 3, []],
      ["Analisar resultados", "TECNICO", 0.5, "TODO", 4, []],
      ["Emitir relatório PPAP", "VALIDADOR", 0.5, "TODO", 5, []],
    ],
    finish: null,
    status: ["prepare"],
  },
];

/* Histórico demo: casos fechados e formalizados que alimentam o Assistente (faixa e fator). [estimado, realizado] */
const HISTORY = [
  { type: "Medição dimensional em MMC", size: "Médio", resources: ["ZEISS PRISMO", "Software ZEISS CALYPSO"],
    cases: [[10, 12], [12, 14.5], [8, 9], [16, 19], [10, 11], [14, 17.5], [12, 12.5], [9, 11], [11, 13], [15, 18], [10, 10.5], [13, 16], [12, 15], [8, 10], [14, 15.5]] },
  { type: "Digitalização 3D", size: "Médio", resources: ["ZEISS ATOS Q", "Software ZEISS INSPECT"], cases: [[6, 7], [8, 8.5], [5, 6.5], [7, 7], [6, 8], [9, 10]] },
  { type: "Engenharia reversa", size: "Grande", resources: ["ZEISS T-SCAN", "Software ZEISS INSPECT"], cases: [[24, 30], [20, 26]] },
];
const MATERIALS = ["Aço", "Alumínio", "Ferro fundido", "Aço", "Polímero"];
const COMPLEXITIES = ["Média", "Alta", "Média", "Baixa"];
const CAUSES = ["Programação subestimada", "Fixação mais complexa que o previsto", "Sem desvio relevante", "Espera por informação do cliente", "Retrabalho por não conformidade", "Preparação de superfície não prevista"];
const LESSONS = {
  "Programação subestimada": ["Peça nova: programação pesa mais que a medição", "Em peças sem programa existente, a programação consumiu cerca de metade do esforço. Separar programação e medição na estimativa."],
  "Fixação mais complexa que o previsto": ["Avaliar fixação antes de orçar", "Pedir foto ou visita técnica quando a peça tiver paredes finas ou geometria instável; a fixação padrão não bastou."],
  "Sem desvio relevante": ["Estimativa padrão confirmada", "O roteiro de estimativa do tipo de serviço funcionou bem para este porte; manter as premissas."],
  "Espera por informação do cliente": ["Confirmar revisão do desenho no aceite", "Parte do tempo foi perdida aguardando a revisão correta do desenho. Confirmar a revisão antes de iniciar."],
  "Retrabalho por não conformidade": ["Registrar condição de recebimento da peça", "A peça chegou com rebarbas e a medição foi refeita após limpeza. Registrar a condição de recebimento."],
  "Preparação de superfície não prevista": ["Superfícies reflexivas exigem preparação", "Prever spray matificante e limpeza em superfícies usinadas ou escuras."],
};

export async function loadDemoData(onProgress = () => {}) {
  const step = message => onProgress(message);
  const status = await call("GET", "/admin/demo-data");
  if (status.demoRequests > 0 || status.demoRecords > 0) throw new Error("Os dados de demonstração já estão carregados. Remova-os antes de carregar novamente.");

  const users = await call("GET", "/admin/users");
  const byRole = role => users.find(user => user.active && user.role === role);
  const people = { TECNICO: byRole("TECNICO"), VALIDADOR: byRole("VALIDADOR") };
  if (!people.TECNICO || !people.VALIDADOR) throw new Error("Cadastre ao menos um perfil Técnico e um Validador ativos na Equipe.");

  const vocabulary = await call("GET", "/knowledge/vocabulary");
  const term = (classCode, label) => {
    if (!label) return null;
    const found = vocabulary.classes.find(item => item.code === classCode)?.terms.find(item => item.label === label);
    if (!found) throw new Error(`Termo ausente no vocabulário: ${label}`);
    return found.id;
  };

  async function closeAndLearn(recordCode, { actualHours, deliveryDaysAgo, rework, scopeChange, cause, lesson, formalize }) {
    const closed = await call("POST", `/knowledge/records/${recordCode}/close`, {
      actualHours, actualCost: null, billedValue: null, actualDelivery: isoDaysFromToday(-deliveryDaysAgo), rework, scopeChange,
      causeIds: [term("DEVIATION_CAUSE", cause)],
      lesson: { title: lesson[0], body: lesson[1], subjectIds: [], confidentiality: "PUBLIC", submit: true },
    });
    const lessonCode = closed.lessons?.at(-1)?.code;
    if (formalize && lessonCode) await call("POST", `/knowledge/lessons/${lessonCode}/decision`, { decision: "FORMALIZE", note: "Validado com a equipe (demonstração)." });
  }

  /* 1. Histórico de casos fechados (sem SOL/ORC): base do Assistente. */
  let historyCount = 0;
  let index = 0;
  for (const group of HISTORY) {
    for (const [estimated, actual] of group.cases) {
      index += 1;
      const cause = actual / estimated <= 1.06 ? "Sem desvio relevante" : CAUSES[index % CAUSES.length] === "Sem desvio relevante" ? "Programação subestimada" : CAUSES[index % CAUSES.length];
      const record = await call("POST", "/knowledge/records", {
        demo: true, confidentiality: "PUBLIC", quoteCode: null, clientCode: `CLI-H${String(index).padStart(2, "0")}`,
        serviceTypeId: term("SERVICE_TYPE", group.type), sizeId: term("SIZE", group.size), materialId: term("MATERIAL", MATERIALS[index % MATERIALS.length]),
        complexityId: term("COMPLEXITY", COMPLEXITIES[index % COMPLEXITIES.length]), featureCountId: null, gdtId: null,
        resourceIds: group.resources.map(label => term("RESOURCE", label)),
        estimatedHours: estimated, estimatedCost: null, proposedValue: estimated * RATE, plannedDelivery: null,
        assumptions: "Caso histórico de demonstração (dados fictícios).", deviationJustification: "Caso histórico de demonstração.",
      });
      await closeAndLearn(record.code, { actualHours: actual, deliveryDaysAgo: 30 + index * 9, rework: cause === "Retrabalho por não conformidade", scopeChange: false, cause, lesson: LESSONS[cause], formalize: true });
      historyCount += 1;
      step(`Histórico do conhecimento: ${historyCount} casos formalizados`);
    }
  }

  /* 2. Projetos completos com tarefas delegadas e horas apontadas. */
  for (const plan of PROJECTS) {
    step(`Projeto ${plan.company}: solicitação e orçamento`);
    const services = plan.service === "reverse-engineering" ? ["scan", "reverse-engineering"] : [plan.service];
    const request = await call("POST", "/requests", {
      demo: true, origin: "Interno", channel: "E-mail",
      contact: { company: plan.company, name: plan.contact, email: plan.email, phone: plan.phone },
      project: { requestNeedId: NEEDS[plan.service], objective: plan.objective, observations: "Dados fictícios de demonstração.", urgency: "normal", deadlineType: "noUrgency", specificDate: "", generalFiles: [] },
      internal: { channel: "E-mail", channelDetails: "Demonstração", department: "" },
      pieces: [{ id: "p1", ...plan.piece, location: "Pode ser levada ao Centro", services,
        requirements: { inspectionOptions: [], scanningOptions: [], reverseOptions: [], internalOptions: [], movable: "", surroundingAccess: "", locationNotes: "" }, recommendation: null }],
    });
    await call("POST", `/requests/${request.id}/analysis/start`);
    await call("POST", `/requests/${request.id}/analysis/finish`, { result: "quote-ready", technicalSummary: plan.objective, recommendedEquipment: plan.equipment, complexity: plan.km.complexity, knowledgeTags: [] });
    let quote = await call("POST", `/requests/${request.id}/quote`, { hourlyRate: RATE, deadlineDays: plan.deadlineDays, validityDays: 15 });
    quote = await call("PUT", `/quotes/${quote.id}`, {
      revision: quote.revision, scope: plan.objective, machineId: plan.machine, deadlineDays: plan.deadlineDays, validityDays: 15, internalCost: null, commercialNotes: "",
      estimateJustification: "Estimativa pelo roteiro do tipo de serviço e casos do Assistente (demonstração).",
      items: [{ id: "item-1", name: `${plan.piece.name} — ${SERVICE_TYPES[plan.service]}`, description: null, serviceId: plan.service, machineId: null, requestPieceId: "p1",
        technicalHours: plan.budget, quotedHours: plan.budget, hourlyRate: RATE, hourlyRateOverrideReason: null, commercialRateReference: RATE, commercialReferenceId: null, commercialReferenceEffectiveFrom: null, referenceCapturedAt: null }],
    });
    quote = await call("POST", `/quotes/${quote.id}/status`, { revision: quote.revision, status: "Em revisão", reason: "Revisão técnica." });
    quote = await call("POST", `/quotes/${quote.id}/status`, { revision: quote.revision, status: "Aprovado internamente", reason: "Aprovado." });
    let proposal = await call("POST", `/quotes/${quote.id}/proposal`);
    const documentData = await call("GET", `/quotes/${quote.id}/proposal/document`);
    proposal = await call("POST", `/quotes/${quote.id}/proposal/versions`, { revision: proposal.revision, sourceQuoteRevision: quote.revision, snapshot: documentData.snapshot,
      pdfFileName: `${quote.id.replace("ORC-", "PROP-")}_V1.pdf`, pdf: { pageCount: 1, format: "A4", size: 0, delivery: { saved: true, method: "demonstração" } } });

    const record = await call("POST", "/knowledge/records", {
      demo: true, confidentiality: "PUBLIC", quoteCode: quote.id, clientCode: plan.km.client,
      serviceTypeId: term("SERVICE_TYPE", SERVICE_TYPES[plan.service]), sizeId: term("SIZE", plan.km.size), materialId: term("MATERIAL", plan.km.material),
      complexityId: term("COMPLEXITY", plan.km.complexity), featureCountId: term("FEATURE_COUNT", plan.km.features), gdtId: term("GDT", plan.km.gdt),
      resourceIds: plan.km.resources.map(label => term("RESOURCE", label)),
      estimatedHours: plan.budget, estimatedCost: null, proposedValue: plan.budget * RATE, plannedDelivery: isoDaysFromToday(plan.deadlineDays),
      assumptions: "Peça recebida limpa; desenho na revisão vigente; sem fixação dedicada (demonstração).", deviationJustification: "Estimativa de demonstração.",
    });
    await call("POST", `/quotes/${quote.id}/proposal/versions/1/result`, { revision: proposal.revision, type: "accepted", date: isoDaysFromToday(0), note: "Aceite (demonstração)." });
    let project = await call("POST", `/quotes/${quote.id}/project`);

    step(`Projeto ${project.projectCode}: tarefas delegadas e horas`);
    for (const [position, [title, role, planned, taskStatus, dueDays, entries]] of plan.tasks.entries()) {
      const task = project.tasks[position];
      project = await call("PUT", `/projects/${project.projectCode}/tasks/${task.id}`, { title, description: null, assigneeId: people[role].id, dueDate: isoDaysFromToday(dueDays), plannedHours: planned });
      for (const [daysAgo, hours, note] of entries) {
        project = await call("POST", `/projects/${project.projectCode}/tasks/${task.id}/time`, { date: isoDaysFromToday(-daysAgo), hours, note, userId: people[role].id });
      }
      if (taskStatus !== "TODO") project = await call("PUT", `/projects/${project.projectCode}/tasks/${task.id}`, { status: taskStatus });
    }
    for (const operation of plan.status) {
      if (operation === "complete") continue;
      project = await call("PUT", `/projects/${project.projectCode}`, { revision: project.revision, operation });
    }
    if (plan.finish?.closeRecord) {
      await closeAndLearn(record.code, { actualHours: Number(project.spentHours), deliveryDaysAgo: 2, rework: plan.finish.rework, scopeChange: plan.finish.scopeChange, cause: plan.finish.cause, lesson: plan.finish.lesson, formalize: plan.finish.formalize });
    }
    if (plan.finish?.complete) {
      project = await call("GET", `/projects/${project.projectCode}`);
      await call("PUT", `/projects/${project.projectCode}`, { revision: project.revision, operation: "complete" });
    }
  }

  /* 3. Uma solicitação nova, para a fila de entrada. */
  await call("POST", "/requests", {
    demo: true, origin: "Interno", channel: "E-mail",
    contact: { company: "Hidráulica Serra Dourada Ltda", name: "Manutenção", email: "manutencao@serradourada.example", phone: "(62) 3000-1005" },
    project: { requestNeedId: "failure-analysis", objective: "Análise de falha de haste de cilindro hidráulico com trinca.", observations: "Dados fictícios de demonstração.", urgency: "priority", deadlineType: "15days", specificDate: "", generalFiles: [] },
    internal: { channel: "E-mail", channelDetails: "Demonstração", department: "" }, pieces: [],
  });
  step("Dados de demonstração carregados.");
  return call("GET", "/admin/demo-data");
}
