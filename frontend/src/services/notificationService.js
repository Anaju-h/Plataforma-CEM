import {
  getCurrentUserWork,
} from "./workService";
import { hasRole } from "./authApi";
import { getCurrentUser } from "./currentUserService";
import { getMyWork, getTaskBoard } from "./taskApi";

/*
 * ============================================================
 * NOTIFICAÇÕES
 * ============================================================
 *
 * Uma notificação é uma representação compacta de uma
 * situação relevante encontrada pelo motor de atenção.
 *
 * Futuramente este serviço também poderá receber:
 *
 * - mudanças de status;
 * - novos comentários;
 * - atribuições;
 * - retorno do cliente;
 * - documentos;
 * - eventos de integração;
 * - notificações externas.
 * ============================================================
 */

let readNotificationIds =
  new Set();

/*
 * ============================================================
 * CONSULTA
 * ============================================================
 */

/*
 * Perfis operacionais (Técnico, Validador, Consulta) recebem avisos das próprias
 * tarefas: novas, com prazo próximo ou atrasadas. O Administrador recebe o motor
 * de atenção completo e as tarefas atrasadas da equipe.
 */
function taskNotifications(work, team) {
  return (work?.tasks || [])
    .filter((row) => !row.project.closed && row.task.status !== "DONE" && (row.overdue || row.dueSoon || (!team && row.task.status === "TODO")))
    .map((row) => {
      const kind = row.overdue ? "late" : row.dueSoon ? "soon" : "new";
      const id = `notification-task-${row.task.id}-${kind}`;
      return {
        id,
        sourceId: row.task.id,
        type: "project",
        referenceId: row.project.id,
        company: row.project.company,
        title: kind === "late" ? "Tarefa atrasada" : kind === "soon" ? "Prazo da tarefa próximo" : "Nova tarefa delegada",
        description: `${row.task.title}${team && row.task.assigneeName ? ` · ${row.task.assigneeName}` : ""}`,
        route: `/portal/projetos/${row.project.id}`,
        level: kind === "late" ? "urgent" : "attention",
        label: kind === "late" ? "Atrasada" : kind === "soon" ? "Prazo próximo" : "Nova",
        priority: kind === "late" ? 90 : kind === "soon" ? 60 : 40,
        read: readNotificationIds.has(id),
      };
    });
}

export async function getNotifications(
  currentUser = "Administrador",
) {
  if (!hasRole(getCurrentUser(), "ADMIN")) {
    return taskNotifications(await getMyWork(), false).sort((a, b) => b.priority - a.priority);
  }
  const team = await getTaskBoard().then((board) => taskNotifications(board, true).filter((item) => item.level === "urgent")).catch(() => []);
  return [...await attentionNotifications(currentUser), ...team].sort((a, b) => b.priority - a.priority);
}

async function attentionNotifications(
  currentUser,
) {
  const work =
    await getCurrentUserWork(
      currentUser,
    );

  return work.attentionItems
    .filter(
      (item) =>
        item.level ===
          "urgent" ||
        item.level ===
          "attention",
    )
    .map(
      (item) => ({
        id:
          `notification-${item.id}`,

        sourceId:
          item.id,

        type:
          item.type,

        referenceId:
          item.referenceId,

        company:
          item.company,

        title:
          item.title,

        description:
          item.description,

        route:
          item.route,

        level:
          item.level,

        label:
          item.urgencyLabel,

        priority:
          item.priority,

        read:
          readNotificationIds.has(
            `notification-${item.id}`,
          ),
      }),
    )
    .sort(
      (a, b) =>
        b.priority -
        a.priority,
    );
}

/*
 * ============================================================
 * CONTADORES
 * ============================================================
 */

export async function getUnreadNotificationCount(
  currentUser = "Administrador",
) {
  return (await getNotifications(
    currentUser,
  )).filter(
    (notification) =>
      !notification.read,
  ).length;
}

/*
 * ============================================================
 * LEITURA
 * ============================================================
 */

export function markNotificationAsRead(
  notificationId,
) {
  readNotificationIds.add(
    notificationId,
  );
}

export async function markAllNotificationsAsRead(
  currentUser = "Administrador",
) {
  const notifications =
    await getNotifications(
      currentUser,
    );

  notifications.forEach(
    (notification) => {
      readNotificationIds.add(
        notification.id,
      );
    },
  );
}
