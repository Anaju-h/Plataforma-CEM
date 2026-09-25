import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Card, ErrorBox, Loading, Pill, RestrictedTag, SuccessBox } from "../../../components/internal/knowledge/KmUi";
import { LESSON_TONES, areaClass, btn, fmt, useLoad } from "../../../components/internal/knowledge/kmUtils";
import { hasRole } from "../../../services/authApi";
import { knowledgeApi } from "../../../services/knowledgeApi";
import { DemoBadge } from "../../../components/internal/DemoBadge";

const FILTERS = [["IN_VALIDATION", "Em validação"], ["FORMALIZED", "Formalizadas"], ["DRAFT", "Rascunhos"], ["SUPERSEDED", "Superadas"], ["", "Todas"]];

export function LessonsPage() {
  const { user, reloadNotices } = useOutletContext();
  const [status, setStatus] = useState("IN_VALIDATION");
  const state = useLoad(() => knowledgeApi.lessons({ status }), [status]);
  const [message, setMessage] = useState("");

  return (
    <Card title="Lições aprendidas e validação" subtitle="Rascunho → Em validação → Formalizada → Superada. Só a formalizada entra nas recomendações; a superada continua consultável.">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map(([value, label]) => <button key={label} type="button" onClick={() => setStatus(value)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${status === value ? "bg-[#071f2d] text-white" : "bg-[#eef2f4] text-[#34505f] hover:bg-[#e2e9ee]"}`}>{label}</button>)}
      </div>
      <SuccessBox>{message}</SuccessBox>
      <Loading state={state}>
        {!state.data?.length ? <p className="py-8 text-center text-[14px] text-[#526d7c]">Nenhuma lição nesta situação.</p> :
          <ul className="mt-3 space-y-3">{state.data.map(lesson => <LessonItem key={lesson.code} lesson={lesson} user={user} onDone={text => { setMessage(text); state.reload(); reloadNotices(); }} />)}</ul>}
      </Loading>
    </Card>
  );
}

function LessonItem({ lesson, user, onDone }) {
  const [note, setNote] = useState("");
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (action, text) => {
    setBusy(true); setError("");
    try { await action(); setMode(null); setNote(""); onDone(text); } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  };
  const validator = hasRole(user, "VALIDADOR");
  return (
    <li className="rounded-[14px] border border-[#e2e9ee] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold text-[#0b5ea8]">{lesson.code}</span>
        <Pill tone={LESSON_TONES[lesson.status]}>{lesson.statusLabel}</Pill>
        {lesson.demo && <DemoBadge />}<RestrictedTag value={lesson.confidentiality} />
        {lesson.recordCode && <Link to={`../registros/${lesson.recordCode}`} className="text-[12px] font-semibold text-[#0b5ea8] hover:underline">{lesson.recordCode}</Link>}
        <span className="ml-auto text-[12px] text-[#7b8f9a]">por {lesson.author} · {fmt.date(lesson.createdAt)}</span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-[#071f2d]">{lesson.title}</p>
      <p className="mt-1 whitespace-pre-line text-[14px] leading-6 text-[#34505f]">{lesson.body}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{lesson.subjects.map(subject => <Pill key={subject.id} tone="gray">{subject.label}</Pill>)}</div>
      {lesson.validationNote && <p className="mt-2 text-[13px] text-[#6a808d]">Nota da validação ({lesson.validatedBy}): {lesson.validationNote}</p>}
      {lesson.status === "SUPERSEDED" && <p className="mt-2 text-[13px] text-[#9a3b2b]">Superada por {lesson.supersededBy} em {fmt.date(lesson.supersededAt)}: {lesson.supersededReason}</p>}
      {lesson.status === "FORMALIZED" && lesson.validatedBy && <p className="mt-2 text-[13px] text-[#17704a]">Formalizada por {lesson.validatedBy} em {fmt.date(lesson.validatedAt)} — alimenta o Assistente.</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {lesson.status === "DRAFT" && hasRole(user, "TECNICO") && <button type="button" disabled={busy} className={btn("secondary")} onClick={() => run(() => knowledgeApi.submitLesson(lesson.code), `${lesson.code} enviada para validação.`)}>Enviar para validação</button>}
        {lesson.status === "IN_VALIDATION" && validator && <>
          <button type="button" disabled={busy} className={btn("success")} onClick={() => run(() => knowledgeApi.decideLesson(lesson.code, "FORMALIZE", note), `${lesson.code} formalizada. Quem assina os assuntos foi avisado.`)}>Formalizar</button>
          <button type="button" disabled={busy} className={btn("secondary")} onClick={() => setMode(mode === "return" ? null : "return")}>Devolver ao autor</button>
        </>}
        {lesson.status === "FORMALIZED" && validator && <button type="button" disabled={busy} className={btn("secondary")} onClick={() => setMode(mode === "supersede" ? null : "supersede")}>Marcar como superada</button>}
        {lesson.status === "IN_VALIDATION" && !validator && <span className="text-[13px] text-[#6a808d]">Aguardando um Validador.</span>}
      </div>
      {mode && <div className="mt-3 space-y-2">
        <textarea className={areaClass} value={note} onChange={event => setNote(event.target.value)} placeholder={mode === "return" ? "O que o autor precisa ajustar?" : "Por que deixou de valer? (equipamento, processo ou premissa mudou)"} />
        <button type="button" disabled={busy} className={btn(mode === "supersede" ? "danger" : "primary")} onClick={() => mode === "return"
          ? run(() => knowledgeApi.decideLesson(lesson.code, "RETURN", note), `${lesson.code} devolvida ao autor.`)
          : run(() => knowledgeApi.supersedeLesson(lesson.code, note), `${lesson.code} marcada como superada; continua consultável, mas sai das recomendações.`)}>Confirmar</button>
      </div>}
      <div className="mt-2"><ErrorBox>{error}</ErrorBox></div>
    </li>
  );
}
