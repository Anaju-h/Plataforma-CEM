import { getCustomerAcceptedProposals } from "../proposalService";
import { getRuntimeProjectById } from "../projectService";
const customer = {
  id: "CUS-001",
  company: {
    id: "EMP-001",
    name: "ACME Indústria Ltda.",
    document: "12.345.678/0001-90",
    city: "Goiânia",
    state: "GO",
  },
  user: {
    id: "USR-001",
    name: "Ana Silva",
    email: "ana@acme.com.br",
    role: "Responsável técnico",
  },
};

const requests = [
  {
    id: "SOL-2026-041",
    service: "Inspeção dimensional",
    part: "Suporte de fixação",
    createdAt: "07/09/2026",
    status: "Em análise",
    description:
      "Verificação dimensional de peça usinada conforme desenho técnico enviado.",
  },
  {
    id: "SOL-2026-036",
    service: "Digitalização 3D",
    part: "Carcaça protótipo",
    createdAt: "28/08/2026",
    status: "Orçamento gerado",
    description:
      "Digitalização completa para obtenção de geometria e comparação com CAD.",
  },
  {
    id: "SOL-2026-029",
    service: "Engenharia reversa",
    part: "Componente mecânico",
    createdAt: "14/08/2026",
    status: "Concluída",
    description:
      "Levantamento geométrico para reconstrução digital do componente.",
  },
];

const projects = [
  {
    id: "PRJ-2026-009",
    quoteId: "ORC-2026-011",
    service: "Engenharia reversa",
    part: "Componente mecânico",
    startedAt: "01/09/2026",
    estimatedDelivery: "18/09/2026",
    status: "Em execução",
    progress: 55,
  },
  {
    id: "PRJ-2026-004",
    quoteId: null,
    service: "Inspeção dimensional",
    part: "Eixo principal",
    startedAt: "03/07/2026",
    estimatedDelivery: "11/07/2026",
    status: "Concluído",
    progress: 100,
  },
];

const documents = [
  {
    id: "DOC-001",
    projectId: "PRJ-2026-004",
    name: "Relatório dimensional final",
    type: "PDF",
    publishedAt: "11/07/2026",
    size: "2,4 MB",
  },
  {
    id: "DOC-002",
    projectId: "PRJ-2026-004",
    name: "Certificado de medição",
    type: "PDF",
    publishedAt: "11/07/2026",
    size: "860 KB",
  },
];

const contactChannels = {
  whatsapp: {
    enabled: false,
    label: "WhatsApp",
    value: "",
  },
  email: {
    enabled: false,
    label: "E-mail",
    value: "",
  },
  phone: {
    enabled: false,
    label: "Telefone",
    value: "",
  },
};

function simulateRequest(data) {
  return Promise.resolve(data);
}

export function getCurrentCustomer() {
  return simulateRequest(customer);
}

export function getCustomerRequests() {
  return simulateRequest(requests);
}

export function getCustomerQuotes() {
  return simulateRequest(getCustomerAcceptedProposals(customer.company.name));
}

export function getCustomerProjects() {
  const acceptedProjects = getCustomerAcceptedProposals(customer.company.name).flatMap(quote => {
    const project = getRuntimeProjectById(quote.projectId);
    if (!project) return [];
    const tasks = project.tasks ?? [];
    return [{ id: project.id, quoteId: quote.id, source: project.source, service: quote.document.snapshot.items.map(item => item.name).join(", "),
      part: "Conforme proposta aceita", startedAt: project.createdAt, estimatedDelivery: project.deadline, status: project.status,
      progress: tasks.length ? Math.round(tasks.filter(task => task.completed).length / tasks.length * 100) : 0 }];
  });
  return simulateRequest([...acceptedProjects, ...projects]);
}

export function getCustomerDocuments() {
  return simulateRequest(documents);
}

export function getCustomerContactChannels() {
  return simulateRequest(contactChannels);
}

export async function sendCustomerMessage(messageData) {
  return {
    success: false,
    configured: false,
    message:
      "O envio de mensagens ainda depende da definição do canal oficial de atendimento do laboratório.",
    data: messageData,
  };
}
