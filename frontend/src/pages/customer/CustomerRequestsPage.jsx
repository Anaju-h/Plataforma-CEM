import { Link, useOutletContext } from "react-router-dom";
import { useCustomerData } from "../../hooks/useCustomerData";
import { CustomerListLayout, CustomerListPanel, CustomerListRow, CustomerStatus } from "../../components/customer/CustomerListLayout";
import { customerDate } from "../../utils/customerDate";
import { getCustomerRequests } from "../../services/customer/customerService";

export function CustomerRequestsPage() {
  const { customer } = useOutletContext();
  const state = useCustomerData(getCustomerRequests);
  return <CustomerListLayout company={customer.company.name} title="Solicitações" description="Acompanhe as solicitações enviadas ao laboratório."
    action={<Link to="/cliente/nova-solicitacao" className="inline-flex min-h-[44px] items-center justify-center rounded-[9px] bg-[#0057b8] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#004a9d]">Nova solicitação</Link>}>
    <CustomerListPanel columns={["Solicitação", "Serviço / peça", "Data", "Status"]} state={state}
      emptyTitle="Nenhuma solicitação por enquanto." emptyDescription="Envie sua primeira solicitação para acompanhar o atendimento do laboratório por aqui.">
      {state.data?.map(request => <CustomerListRow key={request.id}>
        <div><Link className="text-[14px] font-semibold text-[#0057b8] hover:underline" to={"/cliente/solicitacoes/" + request.id}>{request.id}</Link>
          <div className="mt-2 flex flex-wrap gap-2">{request.quotes.map(quote => <Link key={quote.id} className="text-[12px] text-[#6a808d] hover:underline" to={"/cliente/orcamentos?orc=" + quote.id}>{quote.id}</Link>)}</div></div>
        <div><p className="text-[14px] font-medium text-[#34424b]">{request.service}</p><p className="mt-1 text-[12px] leading-5 text-[#89939a]">{request.part}</p></div>
        <div className="text-[12px] leading-5 text-[#89939a]"><p>Enviada em {customerDate(request.createdAt)}</p><p>Atualizada em {customerDate(request.updatedAt)}</p></div>
        <div><CustomerStatus tone={request.tone}>{request.status}</CustomerStatus></div>
      </CustomerListRow>)}
    </CustomerListPanel>
  </CustomerListLayout>;
}
