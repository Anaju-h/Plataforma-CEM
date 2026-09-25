import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, ErrorBox, Loading, SuccessBox, TermChips } from "../../../components/internal/knowledge/KmUi";
import { btn, fmt, useLoad } from "../../../components/internal/knowledge/kmUtils";
import { knowledgeApi } from "../../../services/knowledgeApi";
import { DemoBadge } from "../../../components/internal/DemoBadge";

const SUBJECT_CLASSES = ["SERVICE_TYPE", "MATERIAL", "SIZE", "GDT", "RESOURCE", "DEVIATION_CAUSE"];

export function NoticesPage() {
  const { vocabulary, reloadNotices } = useOutletContext();
  const notices = useLoad(() => knowledgeApi.notices(), []);
  const subscriptions = useLoad(() => knowledgeApi.subscriptions(), []);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selected = draft ?? subscriptions.data ?? [];

  const act = async (action, text) => {
    setError(""); setMessage("");
    try { const data = await action(); notices.setData(data); reloadNotices(); if (text) setMessage(text); } catch (cause) { setError(cause.message); }
  };
  async function save() {
    setError(""); setMessage("");
    try { const saved = await knowledgeApi.setSubscriptions(selected); subscriptions.setData(saved); setDraft(null); setMessage("Assinaturas salvas. Você será avisado quando uma lição sobre esses assuntos for formalizada."); }
    catch (cause) { setError(cause.message); }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <Card title="Avisos" subtitle="Chegam sem precisar procurar: sempre que uma lição sobre um assunto que você assina é formalizada."
        action={notices.data?.unread > 0 && <button type="button" className={btn("secondary")} onClick={() => act(() => knowledgeApi.readAllNotices())}>Marcar todos como lidos</button>}>
        <Loading state={notices}>
          {!notices.data?.items.length ? <p className="py-8 text-center text-[14px] text-[#526d7c]">Nenhum aviso ainda. Assine assuntos ao lado.</p> :
            <ul className="space-y-3">{notices.data.items.map(notice => <li key={notice.id} className={`rounded-[14px] border p-4 ${notice.read ? "border-[#e2e9ee] bg-white" : "border-[#b9d6ec] bg-[#f1f7fc]"}`}>
              <div className="flex flex-wrap items-center gap-2">
                {!notice.read && <span className="h-2 w-2 rounded-full bg-[#d9822b]" aria-label="Não lido" />}
                <p className="text-[13px] font-semibold text-[#0b5ea8]">{notice.reason}</p>
                <span className="ml-auto text-[12px] text-[#7b8f9a]">{fmt.date(notice.createdAt)}</span>
              </div>
              <p className="mt-2 text-[15px] font-semibold text-[#071f2d]">{notice.lesson.code} · {notice.lesson.title} {notice.lesson.demo && <DemoBadge className="ml-1 align-middle" />}</p>
              <p className="mt-1 text-[14px] leading-6 text-[#34505f]">{notice.lesson.body}</p>
              {!notice.read && <button type="button" className="mt-2 text-[13px] font-semibold text-[#0b5ea8] hover:underline" onClick={() => act(() => knowledgeApi.readNotice(notice.id))}>Marcar como lido</button>}
            </li>)}</ul>}
        </Loading>
      </Card>
      <Card title="Assuntos que eu assino" subtitle="Assuntos são termos do vocabulário controlado." action={<button type="button" className={btn()} onClick={save} disabled={!draft}>Salvar assinaturas</button>}>
        <SuccessBox>{message}</SuccessBox><ErrorBox>{error}</ErrorBox>
        <Loading state={subscriptions}>
          <div className="mt-3 space-y-4">{SUBJECT_CLASSES.map(code => <TermChips key={code} vocabulary={vocabulary} classCode={code} values={selected} onChange={setDraft} />)}</div>
        </Loading>
      </Card>
    </div>
  );
}
