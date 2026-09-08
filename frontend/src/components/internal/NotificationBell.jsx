import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";

const currentUser =
  "Administrador";

export function NotificationBell() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const containerRef =
    useRef(null);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState(
    () =>
      getNotifications(
        currentUser,
      ),
  );

  useEffect(() => {
    refreshNotifications();
  }, [
    location.pathname,
  ]);

  useEffect(() => {
    function handleFocus() {
      refreshNotifications();
    }

    window.addEventListener(
      "focus",
      handleFocus,
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus,
      );
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(
      event,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(
      event,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
  ]);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read,
    ).length;

  const urgentCount =
    notifications.filter(
      (notification) =>
        notification.level ===
          "urgent" &&
        !notification.read,
    ).length;

  function refreshNotifications() {
    setNotifications(
      getNotifications(
        currentUser,
      ),
    );
  }

  function togglePanel() {
    if (!open) {
      refreshNotifications();
    }

    setOpen(
      (current) =>
        !current,
    );
  }

  function handleNotificationClick(
    notification,
  ) {
    markNotificationAsRead(
      notification.id,
    );

    refreshNotifications();

    setOpen(false);

    navigate(
      notification.route,
    );
  }

  function handleMarkAllRead() {
    markAllNotificationsAsRead(
      currentUser,
    );

    refreshNotifications();
  }

  function handleOpenWork() {
    setOpen(false);

    navigate(
      "/portal/meu-trabalho",
    );
  }

  return (
    <div
      ref={
        containerRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={
          togglePanel
        }
        aria-label={`Notificações${
          unreadCount > 0
            ? `, ${unreadCount} não lidas`
            : ""
        }`}
        aria-expanded={
          open
        }
        className={`
          relative
          flex h-10 w-10
          items-center
          justify-center
          rounded-full
          border
          transition

          ${
            open
              ? "border-[#8eb6ca] bg-white text-[#096ab2] shadow-[0_7px_20px_rgba(34,67,90,0.08)]"
              : "border-[#cbd9e0] bg-white text-[#567488] hover:border-[#9ebdcd] hover:text-[#096ab2]"
          }
        `}
      >
        <BellIcon />

        {unreadCount >
          0 && (
          <span
            className={`
              absolute
              -right-1
              -top-1
              flex
              min-h-[18px]
              min-w-[18px]
              items-center
              justify-center
              rounded-full
              border-2
              border-[#edf2f5]
              px-1
              text-[8px]
              font-bold
              leading-none
              text-white

              ${
                urgentCount >
                0
                  ? "bg-[#b95b45]"
                  : "bg-[#096ab2]"
              }
            `}
          >
            {unreadCount >
            9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            fixed
            left-4 right-4
            top-[76px]
            z-[100]
            overflow-hidden
            rounded-[20px]
            border border-[#cddbe2]
            bg-white
            shadow-[0_25px_70px_rgba(14,42,60,0.18)]

            sm:absolute
            sm:left-auto
            sm:right-0
            sm:top-[48px]
            sm:w-[390px]
          "
        >
          <div className="border-b border-[#e1e8ec] bg-[#f7fafb] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#17394f]">
                    Notificações
                  </p>

                  {unreadCount >
                    0 && (
                    <span className="rounded-full border border-[#bdd4e1] bg-[#eaf4f9] px-2 py-0.5 text-[8px] font-semibold text-[#397392]">
                      {
                        unreadCount
                      }{" "}
                      nova
                      {unreadCount ===
                      1
                        ? ""
                        : "s"}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[10px] leading-4 text-[#82949e]">
                  Situações que merecem sua atenção.
                </p>
              </div>

              {unreadCount >
                0 && (
                <button
                  type="button"
                  onClick={
                    handleMarkAllRead
                  }
                  className="shrink-0 text-[8px] font-semibold uppercase tracking-[0.07em] text-[#5681a0] transition hover:text-[#096ab2]"
                >
                  Marcar lidas
                </button>
              )}
            </div>
          </div>

          {notifications.length >
          0 ? (
            <div className="max-h-[470px] overflow-y-auto">
              {notifications.map(
                (
                  notification,
                  index,
                ) => (
                  <NotificationItem
                    key={
                      notification.id
                    }
                    notification={
                      notification
                    }
                    first={
                      index ===
                      0
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyNotifications />
          )}

          <div className="border-t border-[#e1e8ec] bg-[#f7fafb] p-3">
            <button
              type="button"
              onClick={
                handleOpenWork
              }
              className="
                flex w-full
                items-center
                justify-between
                rounded-[11px]
                px-3 py-2.5
                text-left
                transition
                hover:bg-white
              "
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#356f9f]">
                  Ver tudo em Meu trabalho
                </p>

                <p className="mt-1 text-[8px] text-[#8a9aa3]">
                  Abra a visão completa de prioridades.
                </p>
              </div>

              <span className="text-sm text-[#6d92a7]">
                →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  first,
  onClick,
}) {
  const urgent =
    notification.level ===
    "urgent";

  const type =
    getNotificationType(
      notification.type,
    );

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        group
        relative
        flex w-full
        gap-3.5
        px-5 py-4
        text-left
        transition
        hover:bg-[#f8fafb]

        ${
          !first
            ? "border-t border-[#e7edf0]"
            : ""
        }

        ${
          notification.read
            ? "bg-white"
            : urgent
              ? "bg-[#fcf8f6]"
              : "bg-[#fbfdfe]"
        }
      `}
    >
      {!notification.read && (
        <span
          className={`
            absolute
            left-1.5
            top-1/2
            h-1.5 w-1.5
            -translate-y-1/2
            rounded-full

            ${
              urgent
                ? "bg-[#b95b45]"
                : "bg-[#1684c5]"
            }
          `}
        />
      )}

      <NotificationIcon
        notification={
          notification
        }
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`
              rounded-full
              border
              px-2 py-0.5
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.07em]

              ${
                urgent
                  ? "border-[#e2c2b7] bg-[#f9ece8] text-[#a45640]"
                  : "border-[#c4dae5] bg-[#edf6fa] text-[#397392]"
              }
            `}
          >
            {
              notification.label
            }
          </span>

          <span className="text-[8px] font-semibold uppercase tracking-[0.07em] text-[#81939d]">
            {
              notification.referenceId
            }
          </span>

          <span className="text-[8px] text-[#a0adb4]">
            ·
          </span>

          <span className="text-[8px] text-[#82949e]">
            {type.label}
          </span>
        </div>

        <p
          className={`
            mt-2
            text-xs
            leading-5
            transition
            group-hover:text-[#096ab2]

            ${
              notification.read
                ? "font-medium text-[#536f80]"
                : "font-semibold text-[#294e64]"
            }
          `}
        >
          {
            notification.title
          }
        </p>

        <p className="mt-1 text-[10px] font-medium text-[#718795]">
          {
            notification.company
          }
        </p>

        <p className="mt-1.5 line-clamp-2 text-[9px] leading-4 text-[#8a9aa3]">
          {
            notification.description
          }
        </p>
      </div>

      <span className="mt-2 shrink-0 text-xs text-[#a0adb4] transition group-hover:translate-x-0.5 group-hover:text-[#5681a0]">
        →
      </span>
    </button>
  );
}

function NotificationIcon({
  notification,
}) {
  const urgent =
    notification.level ===
    "urgent";

  const type =
    getNotificationType(
      notification.type,
    );

  return (
    <span
      className={`
        flex h-9 w-9
        shrink-0
        items-center
        justify-center
        rounded-[10px]
        border
        text-[8px]
        font-bold
        tracking-[-0.02em]

        ${
          urgent
            ? "border-[#e3c7bd] bg-[#f9efeb] text-[#a45640]"
            : "border-[#c7dbe5] bg-[#edf6fa] text-[#397392]"
        }
      `}
    >
      {type.code}
    </span>
  );
}

function EmptyNotifications() {
  return (
    <div className="px-6 py-12 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#cee0e8] bg-[#f5f9fb] text-[#5681a0]">
        <BellIcon />
      </span>

      <p className="mt-3 text-xs font-semibold text-[#536f80]">
        Nenhuma notificação agora.
      </p>

      <p className="mx-auto mt-1.5 max-w-[250px] text-[9px] leading-4 text-[#8a9aa3]">
        Quando uma situação atingir um nível de atenção ou urgência, ela aparecerá aqui.
      </p>
    </div>
  );
}

function getNotificationType(
  type,
) {
  switch (type) {
    case "request":
      return {
        code: "SOL",
        label:
          "Solicitação",
      };

    case "quote":
      return {
        code: "ORC",
        label:
          "Orçamento",
      };

    case "project":
      return {
        code: "PRJ",
        label:
          "Projeto",
      };

    default:
      return {
        code: "•",
        label:
          "Sistema",
      };
  }
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}