import { Link, useOutletContext } from "react-router-dom";
import { useCustomerData } from "../../hooks/useCustomerData";
import { CustomerListLayout, CustomerListPanel, CustomerListRow, CustomerStatus } from "../../components/customer/CustomerListLayout";
import { customerDate } from "../../utils/customerDate";
import { getCustomerProjects } from "../../services/customer/customerService";

export function CustomerProjectsPage() {
  const { customer } = useOutletContext();
  const state = useCustomerData(getCustomerProjects);
  return <CustomerListLayout company={customer.company.name} title="Projetos" description="Acompanhe os serviços aprovados e em execução no laboratório.">
    <CustomerListPanel columns={["Projeto", "Serviço", "Prazo", "Status / progresso"]} state={state}
      emptyTitle="Nenhum projeto em andamento por enquanto." emptyDescription="Quando o laboratório iniciar um projeto aprovado, você poderá acompanhar as etapas aqui.">
      {state.data?.map(project => <CustomerListRow key={project.id}>
        <div><p className="text-[14px] font-semibold text-[#071f2d]">{project.id}</p><p className="mt-1 text-[12px] text-[#89939a]">Origem: {project.quoteId}</p>
          <Link className="mt-2 inline-flex text-[13px] font-semibold text-[#0057b8] hover:underline" to={"/cliente/solicitacoes/" + project.requestId}>Abrir jornada →</Link></div>
        <div><p className="text-[14px] font-medium text-[#34424b]">{project.service}</p><p className="mt-1 text-[12px] leading-5 text-[#89939a]">{project.part}</p></div>
        <div className="text-[12px] leading-5 text-[#89939a]"><p>Entrega: {customerDate(project.estimatedDelivery)}</p><p>Início: {customerDate(project.startedAt)}</p></div>
        <div><CustomerStatus tone={project.tone}>{project.status}</CustomerStatus><div className="mt-3 flex justify-between gap-2 text-[11px] text-[#89939a]"><span>Progresso</span><span>{project.progress}%</span></div>
          <div role="progressbar" aria-label={"Progresso de " + project.id} aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf1f3]"><div className="h-full rounded-full bg-[#0057b8]" style={{ width: `${project.progress}%` }} /></div></div>
      </CustomerListRow>)}
    </CustomerListPanel>
  </CustomerListLayout>;
}
