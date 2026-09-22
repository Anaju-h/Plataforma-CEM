import {
  getCurrentUserWork,
} from "./workService";

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

export async function getNotifications(
  currentUser = "Administrador",
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
