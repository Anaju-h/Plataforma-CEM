import {
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

/* ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================ */

export function CustomerAccountPage() {
  const {
    customer,
  } = useOutletContext();

  const initialUser =
    useMemo(
      () => ({
        name:
          customer?.user?.name ??
          "Cliente",

        email:
          customer?.user?.email ??
          "cliente@empresa.com",

        phone:
          formatPhone(
            customer?.user?.phone ??
            "",
          ),
      }),
      [
        customer,
      ],
    );

  const company =
    useMemo(
      () => ({
        name:
          customer?.company?.name ??
          "Empresa cliente",

        cnpj:
          customer?.company?.cnpj ??
          "",

        city:
          customer?.company?.city ??
          "",

        state:
          customer?.company?.state ??
          "",
      }),
      [
        customer,
      ],
    );

  const [
    profile,
    setProfile,
  ] =
    useState(
      initialUser,
    );

  const [
    securitySettings,
    setSecuritySettings,
  ] =
    useState({
      additionalConfirmation:
        true,

      accessMethod:
        "email-code",
    });

  const [
    modal,
    setModal,
  ] =
    useState(null);

  /* ==========================================================
   * MODAIS
   * ========================================================== */

  function closeModal() {
    setModal(null);
  }

  function openProfileModal() {
    setModal(
      "profile",
    );
  }

  function openEmailModal() {
    setModal(
      "email",
    );
  }

  function openSecurityModal() {
    setModal(
      "security",
    );
  }

  function openDeleteModal() {
    setModal(
      "delete",
    );
  }

  /* ==========================================================
   * SALVAR PERFIL
   * ========================================================== */

  function handleSaveProfile(
    data,
  ) {
    /*
     * BACKEND FUTURO:
     *
     * PATCH /customer/me
     *
     * body:
     * {
     *   name,
     *   phone
     * }
     */

    setProfile(
      (
        current,
      ) => ({
        ...current,

        name:
          data.name,

        phone:
          data.phone,
      }),
    );

    closeModal();
  }

  /* ==========================================================
   * ALTERAR E-MAIL
   * ========================================================== */

  function handleEmailChanged(
    newEmail,
  ) {
    /*
     * BACKEND FUTURO:
     *
     * A troca definitiva só deverá ocorrer
     * depois de o backend validar o código.
     */

    setProfile(
      (
        current,
      ) => ({
        ...current,

        email:
          newEmail,
      }),
    );

    closeModal();
  }

  /* ==========================================================
   * SEGURANÇA
   * ========================================================== */

  function handleSaveSecurity(
    settings,
  ) {
    /*
     * BACKEND FUTURO:
     *
     * PATCH /customer/me/security
     */

    setSecuritySettings(
      settings,
    );

    closeModal();
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1480px]">
        {/* =====================================================
            CABEÇALHO
        ===================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#65b8ee]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#56809a]">
              Área do Cliente
            </p>
          </div>

          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-[#071f2d] sm:text-[36px]">
                Minha conta
              </h1>

              <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-[#607986]">
                Gerencie seus dados pessoais, vínculo com a empresa e
                configurações de acesso ao portal.
              </p>
            </div>

            <div
              className="
                flex
                w-fit
                items-center
                gap-2.5
                rounded-full
                border
                border-[#9fc5d7]/46
                bg-[#e5f0f5]/66
                px-3.5
                py-2
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#4f9a77]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#52778a]">
                Conta ativa
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            DADOS PRINCIPAIS
        ===================================================== */}

        <div className="grid gap-5 xl:grid-cols-2">
          {/* ===================================================
              DADOS PESSOAIS
          =================================================== */}

          <AccountCard
            eyebrow="Perfil"
            title="Dados pessoais"
            description="Informações relacionadas ao seu acesso individual."
            icon={
              <UserIcon />
            }
            action={
              <button
                type="button"
                onClick={
                  openProfileModal
                }
                className="
                  rounded-[10px]
                  border
                  border-[#c5d8e2]/72
                  bg-white/52
                  px-4
                  py-2.5
                  text-[12px]
                  font-semibold
                  text-[#35627b]
                  transition-all
                  duration-200
                  hover:border-[#9eb9c9]
                  hover:bg-white
                "
              >
                Editar dados
              </button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InformationField
                label="Nome"
                value={
                  profile.name
                }
              />

              <InformationField
                label="E-mail"
                value={
                  profile.email
                }
              />

              <InformationField
                label="Telefone"
                value={
                  profile.phone ||
                  "Não informado"
                }
              />

              <InformationField
                label="Tipo de acesso"
                value="Cliente"
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[13px] border border-[#d9e6ec]/74 bg-[#edf5f8]/64 px-4 py-4">
              <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[#65b8ee]" />

              <p className="text-[11px] leading-5 text-[#5f7886]">
                Estes dados identificam o usuário responsável pelo acesso à
                Área do Cliente.
              </p>
            </div>
          </AccountCard>

          {/* ===================================================
              EMPRESA
          =================================================== */}

          <AccountCard
            eyebrow="Vínculo"
            title="Empresa"
            description="Organização associada a este acesso."
            icon={
              <CompanyIcon />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InformationField
                label="Razão social / nome"
                value={
                  company.name
                }
              />

              <InformationField
                label="CNPJ"
                value={
                  company.cnpj ||
                  "Não informado"
                }
              />

              <InformationField
                label="Cidade"
                value={
                  company.city ||
                  "Não informada"
                }
              />

              <InformationField
                label="Estado"
                value={
                  company.state ||
                  "Não informado"
                }
              />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[13px] border border-[#d9e6ec]/74 bg-[#edf5f8]/64 px-4 py-4">
              <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[#65b8ee]" />

              <p className="text-[11px] leading-5 text-[#5f7886]">
                Solicitações, orçamentos, projetos e documentos pertencem ao
                histórico da empresa e não à conta individual do usuário.
              </p>
            </div>
          </AccountCard>
        </div>

        {/* =====================================================
            SEGURANÇA E ACESSO
        ===================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-[22px]
            border
            border-white/72
            bg-white/52
            shadow-[0_12px_34px_rgba(31,68,92,0.06)]
            backdrop-blur-[18px]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              border-b
              border-[#dfe9ee]/74
              px-6
              py-6
              sm:px-7
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  border
                  border-[#cfe0e8]
                  bg-[#edf5f8]
                  text-[#356f9f]
                "
              >
                <ShieldIcon />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#6e8da0]">
                  Segurança
                </p>

                <h2 className="mt-1 text-[19px] font-semibold tracking-[-0.025em] text-[#071f2d]">
                  Acesso à conta
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-[#708793]">
                  Gerencie o e-mail utilizado para acesso e as verificações de
                  segurança.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  openEmailModal
                }
                className="
                  rounded-[10px]
                  border
                  border-[#c5d8e2]/72
                  bg-white/60
                  px-4
                  py-2.5
                  text-[12px]
                  font-semibold
                  text-[#35627b]
                  transition-all
                  duration-200
                  hover:border-[#9eb9c9]
                  hover:bg-white
                "
              >
                Alterar e-mail
              </button>

              <button
                type="button"
                onClick={
                  openSecurityModal
                }
                className="
                  rounded-[10px]
                  bg-[#12364e]
                  px-4
                  py-2.5
                  text-[12px]
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#0d2d41]
                "
              >
                Gerenciar segurança
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3">
            <SecurityBlock
              label="E-mail de acesso"
              value={
                profile.email
              }
              description="Utilizado para identificação e recebimento de códigos."
              icon={
                <MailIcon />
              }
            />

            <SecurityBlock
              label="Método de acesso"
              value="Código por e-mail"
              description="A autenticação real será validada pelo servidor."
              icon={
                <KeyIcon />
              }
              border
            />

            <SecurityBlock
              label="Confirmação adicional"
              value={
                securitySettings.additionalConfirmation
                  ? "Ativada"
                  : "Desativada"
              }
              description="Proteção adicional para alterações sensíveis da conta."
              icon={
                <VerificationIcon />
              }
              border
              positive={
                securitySettings.additionalConfirmation
              }
            />
          </div>
        </section>

        {/* =====================================================
            RESUMO DE VÍNCULO
        ===================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <section
            className="
              relative
              overflow-hidden
              rounded-[22px]
              border
              border-white/72
              bg-[linear-gradient(135deg,rgba(237,246,250,0.82)_0%,rgba(226,240,247,0.72)_100%)]
              px-6
              py-6
              shadow-[0_10px_30px_rgba(31,68,92,0.045)]
              backdrop-blur-[18px]
              sm:px-7
            "
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#65b8ee]/12 blur-[62px]"
            />

            <div className="relative z-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64869a]">
                Estrutura da conta
              </p>

              <h2 className="mt-2 max-w-[820px] text-[18px] font-semibold leading-6 tracking-[-0.025em] text-[#12364e]">
                Seu acesso está vinculado à empresa, sem substituir o histórico
                corporativo.
              </h2>

              <p className="mt-2 max-w-[800px] text-[11px] leading-5 text-[#647c89]">
                Caso seu acesso individual seja encerrado, os registros
                operacionais e comerciais relacionados à empresa continuam
                preservados conforme as regras do sistema.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <AccountTag>
                  Solicitações
                </AccountTag>

                <AccountTag>
                  Orçamentos
                </AccountTag>

                <AccountTag>
                  Projetos
                </AccountTag>

                <AccountTag>
                  Documentos
                </AccountTag>
              </div>
            </div>
          </section>

          <section
            className="
              rounded-[22px]
              border
              border-white/72
              bg-white/50
              px-6
              py-6
              shadow-[0_10px_30px_rgba(31,68,92,0.045)]
              backdrop-blur-[18px]
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#718a98]">
              Conta
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[12px]
                  bg-[#12364e]
                  text-[11px]
                  font-semibold
                  text-white
                "
              >
                {getInitials(
                  profile.name,
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#173f57]">
                  {
                    profile.name
                  }
                </p>

                <p className="mt-0.5 truncate text-[10px] text-[#718792]">
                  {
                    profile.email
                  }
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-[#dce7ec]/74 pt-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#81939d]">
                  Status
                </p>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#4f9a77]" />

                  <span className="text-[11px] font-semibold text-[#4e7563]">
                    Ativa
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#81939d]">
                  Empresa
                </p>

                <p className="max-w-[180px] truncate text-right text-[11px] font-medium text-[#526b78]">
                  {
                    company.name
                  }
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            ZONA DE SEGURANÇA
        ===================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-[22px]
            border
            border-[#e4d9d9]/82
            bg-white/50
            shadow-[0_10px_30px_rgba(88,44,44,0.035)]
            backdrop-blur-[18px]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              px-6
              py-6
              sm:px-7
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a26e6e]">
                Zona de segurança
              </p>

              <h2 className="mt-1.5 text-[18px] font-semibold tracking-[-0.025em] text-[#483434]">
                Excluir minha conta
              </h2>

              <p className="mt-2 max-w-[800px] text-[11px] leading-5 text-[#806f6f]">
                Esta ação encerra seu acesso pessoal ao portal. O histórico
                técnico e comercial relacionado à empresa não é
                automaticamente excluído.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openDeleteModal
              }
              className="
                shrink-0
                rounded-[10px]
                border
                border-[#d8bcbc]
                bg-white/58
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-[#985858]
                transition-all
                duration-200
                hover:border-[#c49393]
                hover:bg-white
              "
            >
              Excluir minha conta
            </button>
          </div>
        </section>
      </div>

      {/* =====================================================
          MODAL — EDITAR PERFIL
      ===================================================== */}

      {modal ===
        "profile" && (
        <EditProfileModal
          profile={
            profile
          }
          onClose={
            closeModal
          }
          onSave={
            handleSaveProfile
          }
        />
      )}

      {/* =====================================================
          MODAL — ALTERAR EMAIL
      ===================================================== */}

      {modal ===
        "email" && (
        <ChangeEmailModal
          currentEmail={
            profile.email
          }
          onClose={
            closeModal
          }
          onCompleted={
            handleEmailChanged
          }
        />
      )}

      {/* =====================================================
          MODAL — SEGURANÇA
      ===================================================== */}

      {modal ===
        "security" && (
        <SecurityModal
          email={
            profile.email
          }
          settings={
            securitySettings
          }
          onClose={
            closeModal
          }
          onSave={
            handleSaveSecurity
          }
        />
      )}

      {/* =====================================================
          MODAL — EXCLUSÃO
      ===================================================== */}

      {modal ===
        "delete" && (
        <DeleteAccountModal
          email={
            profile.email
          }
          onClose={
            closeModal
          }
        />
      )}
    </>
  );
}

/* ============================================================
 * CARD
 * ============================================================ */

function AccountCard({
  eyebrow,
  title,
  description,
  icon,
  action,
  children,
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-white/72
        bg-white/52
        shadow-[0_12px_34px_rgba(31,68,92,0.055)]
        backdrop-blur-[18px]
      "
    >
      <div className="flex items-start justify-between gap-5 border-b border-[#dfe9ee]/74 px-6 py-5 sm:px-7">
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              border
              border-[#cfe0e8]
              bg-[#edf5f8]
              text-[#356f9f]
            "
          >
            {icon}
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#64869a]">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.025em] text-[#071f2d]">
              {title}
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-[#718792]">
              {description}
            </p>
          </div>
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      <div className="px-6 py-5 sm:px-7">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
 * CAMPO
 * ============================================================ */

function InformationField({
  label,
  value,
}) {
  return (
    <div
      className="
        min-h-[72px]
        rounded-[13px]
        border
        border-[#dce7ec]/82
        bg-[#f7fafb]/68
        px-4
        py-3.5
      "
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#7e929d]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-[12px] font-medium leading-5 text-[#354f5e]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
 * SEGURANÇA
 * ============================================================ */

function SecurityBlock({
  label,
  value,
  description,
  icon,
  border = false,
  positive = false,
}) {
  return (
    <div
      className={`
        px-6
        py-5
        sm:px-7

        ${
          border
            ? "border-t border-[#e1eaee] lg:border-l lg:border-t-0"
            : ""
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-[10px]
            bg-[#eef5f8]
            text-[#4d7890]
          "
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#7e929d]">
            {label}
          </p>

          <div className="mt-1 flex items-center gap-2">
            {positive && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#4f9a77]" />
            )}

            <p className="truncate text-[12px] font-semibold text-[#304d5d]">
              {value}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#6d8491]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
 * TAG
 * ============================================================ */

function AccountTag({
  children,
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-white/72
        bg-white/48
        px-3
        py-1.5
        text-[10px]
        font-medium
        text-[#547386]
      "
    >
      {children}
    </span>
  );
}

/* ============================================================
 * MODAL BASE
 * ============================================================ */

function ModalShell({
  children,
  onClose,
  width =
    "max-w-[520px]",
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-[#071f2d]/36
        px-5
        py-8
        backdrop-blur-[6px]
      "
    >
      <div
        className={`
          relative
          w-full
          ${width}
          overflow-hidden
          rounded-[24px]
          border
          border-white/72
          bg-[#f4f8fa]
          shadow-[0_30px_90px_rgba(7,31,45,0.24)]
        `}
      >
        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Fechar"
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-[#708691]
            transition-all
            hover:bg-white
            hover:text-[#12364e]
          "
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

/* ============================================================
 * EDITAR PERFIL
 * ============================================================ */

function EditProfileModal({
  profile,
  onClose,
  onSave,
}) {
  const [
    form,
    setForm,
  ] =
    useState({
      name:
        profile.name,

      phone:
        profile.phone,
    });

  const [
    error,
    setError,
  ] =
    useState("");

  function handleChange(
    field,
    value,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );

    setError("");
  }

  function handlePhoneChange(
    value,
  ) {
    const formatted =
      formatPhone(
        value,
      );

    setForm(
      (
        current,
      ) => ({
        ...current,

        phone:
          formatted,
      }),
    );

    setError("");
  }

  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    const name =
      form.name.trim();

    const phoneDigits =
      onlyDigits(
        form.phone,
      );

    if (
      !name
    ) {
      setError(
        "Informe o nome do usuário.",
      );

      return;
    }

    if (
      phoneDigits.length >
        0 &&
      phoneDigits.length <
        10
    ) {
      setError(
        "Informe um telefone com DDD e pelo menos 10 dígitos.",
      );

      return;
    }

    if (
      phoneDigits.length >
        11
    ) {
      setError(
        "O telefone pode possuir no máximo 11 dígitos.",
      );

      return;
    }

    onSave({
      name,

      phone:
        formatPhone(
          phoneDigits,
        ),
    });
  }

  return (
    <ModalShell
      onClose={
        onClose
      }
    >
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="px-7 pb-7 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#56809a]">
            Perfil
          </p>

          <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.03em] text-[#071f2d]">
            Editar dados pessoais
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[#6c838f]">
            Atualize as informações relacionadas ao seu usuário.
          </p>

          <div className="mt-6 space-y-4">
            <ModalField
              label="Nome"
              value={
                form.name
              }
              onChange={(
                event,
              ) =>
                handleChange(
                  "name",
                  event.target.value,
                )
              }
              placeholder="Nome completo"
            />

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6f8793]">
                Telefone
              </span>

              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={
                  form.phone
                }
                onChange={(
                  event,
                ) =>
                  handlePhoneChange(
                    event.target.value,
                  )
                }
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="
                  mt-2
                  h-11
                  w-full
                  rounded-[11px]
                  border
                  border-[#ccdce4]
                  bg-white/72
                  px-3.5
                  text-[13px]
                  text-[#324d5d]
                  outline-none
                  transition-all
                  placeholder:text-[#9baab2]
                  focus:border-[#7da9c1]
                  focus:ring-4
                  focus:ring-[#65b8ee]/10
                "
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-[10px] text-[#788d98]">
                  Informe DDD + telefone.
                </p>

                <p className="text-[10px] font-medium text-[#6d8390]">
                  {
                    onlyDigits(
                      form.phone,
                    ).length
                  }
                  /11 dígitos
                </p>
              </div>
            </label>
          </div>

          {error && (
            <p className="mt-3 text-[11px] font-medium text-[#a65d5d]">
              {error}
            </p>
          )}

          <p className="mt-5 text-[10px] leading-5 text-[#7c909b]">
            Nesta fase do front, a alteração permanece apenas durante a sessão.
            A persistência será realizada pela API.
          </p>
        </div>

        <ModalFooter
          onCancel={
            onClose
          }
          primaryLabel="Salvar alterações"
        />
      </form>
    </ModalShell>
  );
}

/* ============================================================
 * ALTERAR EMAIL
 * ============================================================ */

function ChangeEmailModal({
  currentEmail,
  onClose,
  onCompleted,
}) {
  const [
    step,
    setStep,
  ] =
    useState(
      "email",
    );

  const [
    newEmail,
    setNewEmail,
  ] =
    useState("");

  const [
    code,
    setCode,
  ] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [
    error,
    setError,
  ] =
    useState("");

  function handleRequestCode(
    event,
  ) {
    event.preventDefault();

    const normalized =
      newEmail
        .trim()
        .toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalized,
      )
    ) {
      setError(
        "Informe um e-mail válido.",
      );

      return;
    }

    if (
      normalized ===
      currentEmail.toLowerCase()
    ) {
      setError(
        "Informe um e-mail diferente do atual.",
      );

      return;
    }

    setNewEmail(
      normalized,
    );

    setError("");

    setStep(
      "code",
    );
  }

  function handleCodeChange(
    index,
    value,
  ) {
    const sanitized =
      value
        .replace(
          /\D/g,
          "",
        )
        .slice(
          0,
          1,
        );

    setCode(
      (
        current,
      ) => {
        const next =
          [
            ...current,
          ];

        next[
          index
        ] =
          sanitized;

        return next;
      },
    );

    setError("");

    if (
      sanitized &&
      index <
        5
    ) {
      document
        .getElementById(
          `email-code-${index + 1}`,
        )
        ?.focus();
    }
  }

  function handleCodeKeyDown(
    event,
    index,
  ) {
    if (
      event.key ===
        "Backspace" &&
      !code[
        index
      ] &&
      index >
        0
    ) {
      document
        .getElementById(
          `email-code-${index - 1}`,
        )
        ?.focus();
    }
  }

  function handleVerifyCode() {
    const completeCode =
      code.join(
        "",
      );

    if (
      completeCode.length !==
      6
    ) {
      setError(
        "Digite os 6 dígitos do código.",
      );

      return;
    }

    setStep(
      "success",
    );
  }

  return (
    <ModalShell
      onClose={
        onClose
      }
    >
      {step ===
        "email" && (
        <form
          onSubmit={
            handleRequestCode
          }
        >
          <div className="px-7 pb-7 pt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#56809a]">
              Segurança
            </p>

            <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.03em] text-[#071f2d]">
              Alterar e-mail
            </h2>

            <p className="mt-2 text-[11px] leading-5 text-[#6c838f]">
              Atualmente sua conta utiliza{" "}
              <span className="font-semibold text-[#516b7a]">
                {
                  currentEmail
                }
              </span>
              .
            </p>

            <div className="mt-6">
              <ModalField
                label="Novo e-mail"
                type="email"
                value={
                  newEmail
                }
                onChange={(
                  event,
                ) => {
                  setNewEmail(
                    event.target.value,
                  );

                  setError(
                    "",
                  );
                }}
                placeholder="novo.email@empresa.com"
              />
            </div>

            <div className="mt-5 rounded-[12px] border border-[#d8e6ec] bg-[#edf5f8] px-4 py-3.5">
              <p className="text-[10px] leading-5 text-[#637d8a]">
                A alteração só será concluída após uma confirmação adicional.
              </p>
            </div>

            {error && (
              <p className="mt-3 text-[11px] font-medium text-[#a65d5d]">
                {error}
              </p>
            )}
          </div>

          <ModalFooter
            onCancel={
              onClose
            }
            primaryLabel="Enviar código"
          />
        </form>
      )}

      {step ===
        "code" && (
        <div className="px-7 pb-7 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#56809a]">
            Verificação
          </p>

          <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.03em] text-[#071f2d]">
            Confirme a alteração
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[#6c838f]">
            Na integração real, enviaremos um código de segurança para validar a
            alteração para{" "}
            <span className="font-semibold text-[#516b7a]">
              {
                newEmail
              }
            </span>
            .
          </p>

          <CodeInput
            idPrefix="email-code"
            code={
              code
            }
            onChange={
              handleCodeChange
            }
            onKeyDown={
              handleCodeKeyDown
            }
          />

          {error && (
            <p className="mt-3 text-[11px] font-medium text-[#a65d5d]">
              {error}
            </p>
          )}

          <p className="mt-4 text-[10px] leading-5 text-[#7c909b]">
            Fluxo demonstrativo: nesta fase, qualquer sequência de seis dígitos
            permite validar a interface.
          </p>

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setStep(
                  "email",
                )
              }
              className="
                rounded-[9px]
                border
                border-[#d1dee4]
                bg-white
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-[#607785]
              "
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={
                handleVerifyCode
              }
              className="
                rounded-[9px]
                bg-[#12364e]
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-white
                hover:bg-[#0d2d41]
              "
            >
              Confirmar alteração
            </button>
          </div>
        </div>
      )}

      {step ===
        "success" && (
        <div className="px-7 pb-7 pt-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e5f1eb] text-[#4f8c6e]">
            <CheckIcon />
          </div>

          <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-[#213b2e]">
            E-mail confirmado
          </h2>

          <p className="mx-auto mt-2 max-w-[350px] text-[11px] leading-5 text-[#71827a]">
            O fluxo de alteração foi concluído corretamente no front.
          </p>

          <button
            type="button"
            onClick={() =>
              onCompleted(
                newEmail,
              )
            }
            className="
              mt-6
              rounded-[9px]
              bg-[#12364e]
              px-5
              py-2.5
              text-[12px]
              font-semibold
              text-white
              hover:bg-[#0d2d41]
            "
          >
            Concluir
          </button>
        </div>
      )}
    </ModalShell>
  );
}

/* ============================================================
 * SEGURANÇA
 * ============================================================ */

function SecurityModal({
  email,
  settings,
  onClose,
  onSave,
}) {
  const [
    form,
    setForm,
  ] =
    useState({
      ...settings,
    });

  return (
    <ModalShell
      onClose={
        onClose
      }
    >
      <div className="px-7 pb-7 pt-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#56809a]">
          Segurança
        </p>

        <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.03em] text-[#071f2d]">
          Gerenciar segurança
        </h2>

        <p className="mt-2 text-[11px] leading-5 text-[#6c838f]">
          Configure proteções relacionadas ao acesso e a alterações sensíveis.
        </p>

        <div className="mt-6 rounded-[14px] border border-[#dbe6eb] bg-white/64 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#798e99]">
            Método de acesso
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#edf5f8] text-[#47738b]">
              <MailIcon />
            </span>

            <div>
              <p className="text-[12px] font-semibold text-[#304d5d]">
                Código temporário por e-mail
              </p>

              <p className="mt-0.5 text-[10px] text-[#718792]">
                {
                  email
                }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[14px] border border-[#dbe6eb] bg-white/64 px-4 py-4">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[12px] font-semibold text-[#304d5d]">
                Confirmação adicional
              </p>

              <p className="mt-1 max-w-[320px] text-[10px] leading-5 text-[#718792]">
                Exigir uma nova validação antes de alterações sensíveis, como
                troca de e-mail ou encerramento da conta.
              </p>
            </div>

            <Toggle
              checked={
                form.additionalConfirmation
              }
              onChange={() =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    additionalConfirmation:
                      !current.additionalConfirmation,
                  }),
                )
              }
            />
          </div>
        </div>

        <div className="mt-4 rounded-[12px] border border-[#d8e6ec] bg-[#edf5f8] px-4 py-3.5">
          <p className="text-[10px] leading-5 text-[#637d8a]">
            O servidor será responsável por aplicar estas regras e validar a
            sessão autenticada quando o backend for conectado.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#dfe8ec] bg-white/40 px-7 py-4">
        <button
          type="button"
          onClick={
            onClose
          }
          className="
            rounded-[9px]
            border
            border-[#d1dee4]
            bg-white
            px-4
            py-2.5
            text-[12px]
            font-semibold
            text-[#607785]
          "
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() =>
            onSave(
              form,
            )
          }
          className="
            rounded-[9px]
            bg-[#12364e]
            px-4
            py-2.5
            text-[12px]
            font-semibold
            text-white
            hover:bg-[#0d2d41]
          "
        >
          Salvar
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
 * EXCLUSÃO DA CONTA
 * ============================================================ */

function DeleteAccountModal({
  email,
  onClose,
}) {
  const [
    step,
    setStep,
  ] =
    useState(
      "warning",
    );

  const [
    code,
    setCode,
  ] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [
    error,
    setError,
  ] =
    useState("");

  function handleCodeChange(
    index,
    value,
  ) {
    const sanitized =
      value
        .replace(
          /\D/g,
          "",
        )
        .slice(
          0,
          1,
        );

    setCode(
      (
        current,
      ) => {
        const next =
          [
            ...current,
          ];

        next[
          index
        ] =
          sanitized;

        return next;
      },
    );

    setError("");

    if (
      sanitized &&
      index <
        5
    ) {
      document
        .getElementById(
          `delete-code-${index + 1}`,
        )
        ?.focus();
    }
  }

  function handleCodeKeyDown(
    event,
    index,
  ) {
    if (
      event.key ===
        "Backspace" &&
      !code[
        index
      ] &&
      index >
        0
    ) {
      document
        .getElementById(
          `delete-code-${index - 1}`,
        )
        ?.focus();
    }
  }

  function handleConfirmDelete() {
    if (
      code.join(
        "",
      ).length !==
      6
    ) {
      setError(
        "Digite os 6 dígitos do código.",
      );

      return;
    }

    setStep(
      "success",
    );
  }

  return (
    <ModalShell
      onClose={
        onClose
      }
    >
      {step ===
        "warning" && (
        <div className="px-7 pb-7 pt-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#f4e8e8] text-[#9a5959]">
            <WarningIcon />
          </div>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a06b6b]">
            Exclusão da conta
          </p>

          <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.03em] text-[#392929]">
            Encerrar seu acesso?
          </h2>

          <p className="mt-3 text-[11px] leading-5 text-[#806f6f]">
            Você perderá acesso ao portal. Solicitações, orçamentos, projetos e
            documentos relacionados à empresa não serão apagados
            automaticamente.
          </p>

          <div className="mt-5 rounded-[12px] border border-[#eadede] bg-[#fffafa] px-4 py-4">
            <p className="text-[10px] leading-5 text-[#806f6f]">
              Uma confirmação adicional será necessária antes do encerramento.
            </p>
          </div>

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={
                onClose
              }
              className="
                rounded-[9px]
                border
                border-[#d1dee4]
                bg-white
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-[#607785]
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() =>
                setStep(
                  "code",
                )
              }
              className="
                rounded-[9px]
                bg-[#965757]
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-white
                hover:bg-[#824949]
              "
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step ===
        "code" && (
        <div className="px-7 pb-7 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a06b6b]">
            Confirmação
          </p>

          <h2 className="mt-2 text-[23px] font-semibold tracking-[-0.03em] text-[#392929]">
            Confirme a exclusão
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[#806f6f]">
            Na versão integrada, enviaremos um código para{" "}
            <span className="font-semibold">
              {
                email
              }
            </span>
            .
          </p>

          <CodeInput
            idPrefix="delete-code"
            code={
              code
            }
            onChange={
              handleCodeChange
            }
            onKeyDown={
              handleCodeKeyDown
            }
            danger
          />

          {error && (
            <p className="mt-3 text-[11px] font-medium text-[#a65d5d]">
              {error}
            </p>
          )}

          <p className="mt-4 text-[10px] leading-5 text-[#8b7a7a]">
            Fluxo demonstrativo: nenhuma conta real será apagada nesta fase.
          </p>

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setStep(
                  "warning",
                )
              }
              className="
                rounded-[9px]
                border
                border-[#d1dee4]
                bg-white
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-[#607785]
              "
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={
                handleConfirmDelete
              }
              className="
                rounded-[9px]
                bg-[#965757]
                px-4
                py-2.5
                text-[12px]
                font-semibold
                text-white
                hover:bg-[#824949]
              "
            >
              Confirmar exclusão
            </button>
          </div>
        </div>
      )}

      {step ===
        "success" && (
        <div className="px-7 pb-7 pt-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e5f1eb] text-[#4f8c6e]">
            <CheckIcon />
          </div>

          <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-[#213b2e]">
            Fluxo validado
          </h2>

          <p className="mx-auto mt-2 max-w-[350px] text-[11px] leading-5 text-[#71827a]">
            A interface de exclusão está pronta. Nenhuma conta real foi
            alterada.
          </p>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              mt-6
              rounded-[9px]
              bg-[#12364e]
              px-5
              py-2.5
              text-[12px]
              font-semibold
              text-white
              hover:bg-[#0d2d41]
            "
          >
            Fechar
          </button>
        </div>
      )}
    </ModalShell>
  );
}

/* ============================================================
 * FIELD DO MODAL
 * ============================================================ */

function ModalField({
  label,
  ...props
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6f8793]">
        {label}
      </span>

      <input
        {...props}
        className="
          mt-2
          h-11
          w-full
          rounded-[11px]
          border
          border-[#ccdce4]
          bg-white/72
          px-3.5
          text-[13px]
          text-[#324d5d]
          outline-none
          transition-all
          placeholder:text-[#9baab2]
          focus:border-[#7da9c1]
          focus:ring-4
          focus:ring-[#65b8ee]/10
        "
      />
    </label>
  );
}

/* ============================================================
 * FOOTER DE MODAL
 * ============================================================ */

function ModalFooter({
  onCancel,
  primaryLabel,
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-[#dfe8ec] bg-white/40 px-7 py-4">
      <button
        type="button"
        onClick={
          onCancel
        }
        className="
          rounded-[9px]
          border
          border-[#d1dee4]
          bg-white
          px-4
          py-2.5
          text-[12px]
          font-semibold
          text-[#607785]
        "
      >
        Cancelar
      </button>

      <button
        type="submit"
        className="
          rounded-[9px]
          bg-[#12364e]
          px-4
          py-2.5
          text-[12px]
          font-semibold
          text-white
          hover:bg-[#0d2d41]
        "
      >
        {primaryLabel}
      </button>
    </div>
  );
}

/* ============================================================
 * CÓDIGO
 * ============================================================ */

function CodeInput({
  idPrefix,
  code,
  onChange,
  onKeyDown,
  danger = false,
}) {
  return (
    <div className="mt-6 grid grid-cols-6 gap-2">
      {code.map(
        (
          digit,
          index,
        ) => (
          <input
            key={
              index
            }
            id={`${idPrefix}-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={
              digit
            }
            onChange={(
              event,
            ) =>
              onChange(
                index,
                event.target.value,
              )
            }
            onKeyDown={(
              event,
            ) =>
              onKeyDown(
                event,
                index,
              )
            }
            aria-label={`Dígito ${index + 1} do código`}
            className={`
              h-[52px]
              min-w-0
              rounded-[10px]
              border
              bg-white
              text-center
              text-[17px]
              font-semibold
              outline-none
              transition-all

              ${
                danger
                  ? `
                    border-[#ddcaca]
                    text-[#744b4b]
                    focus:border-[#b68080]
                    focus:ring-4
                    focus:ring-[#b68080]/10
                  `
                  : `
                    border-[#ccdce4]
                    text-[#31566d]
                    focus:border-[#7da9c1]
                    focus:ring-4
                    focus:ring-[#65b8ee]/10
                  `
              }
            `}
          />
        ),
      )}
    </div>
  );
}

/* ============================================================
 * TOGGLE
 * ============================================================ */

function Toggle({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={
        onChange
      }
      aria-pressed={
        checked
      }
      className={`
        relative
        h-[26px]
        w-[46px]
        shrink-0
        rounded-full
        transition-all
        duration-200

        ${
          checked
            ? "bg-[#356f9f]"
            : "bg-[#c8d4da]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-[3px]
          h-5
          w-5
          rounded-full
          bg-white
          shadow-[0_2px_7px_rgba(0,0,0,0.14)]
          transition-all
          duration-200

          ${
            checked
              ? "left-[23px]"
              : "left-[3px]"
          }
        `}
      />
    </button>
  );
}

/* ============================================================
 * TRATAMENTO DE TELEFONE
 * ============================================================ */

function onlyDigits(
  value,
) {
  return String(
    value ?? "",
  ).replace(
    /\D/g,
    "",
  );
}

function formatPhone(
  value,
) {
  const digits =
    onlyDigits(
      value,
    ).slice(
      0,
      11,
    );

  if (
    digits.length ===
    0
  ) {
    return "";
  }

  if (
    digits.length <=
    2
  ) {
    return `(${digits}`;
  }

  const ddd =
    digits.slice(
      0,
      2,
    );

  const number =
    digits.slice(
      2,
    );

  if (
    number.length <=
    4
  ) {
    return `(${ddd}) ${number}`;
  }

  if (
    digits.length <=
    10
  ) {
    return `(${ddd}) ${number.slice(
      0,
      4,
    )}-${number.slice(
      4,
      8,
    )}`;
  }

  return `(${ddd}) ${number.slice(
    0,
    5,
  )}-${number.slice(
    5,
    9,
  )}`;
}

/* ============================================================
 * AUXILIARES
 * ============================================================ */

function getInitials(
  name,
) {
  const parts =
    String(
      name ||
        "Cliente",
    )
      .trim()
      .split(
        /\s+/,
      )
      .filter(
        Boolean,
      );

  if (
    parts.length ===
    1
  ) {
    return parts[
      0
    ]
      .slice(
        0,
        2,
      )
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* ============================================================
 * ÍCONES
 * ============================================================ */

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 21c.8-4.1 3.3-6.2 7.5-6.2s6.7 2.1 7.5 6.2" />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21V7h10v14" />
      <path d="M14 11h6v10" />
      <path d="M8 11h2" />
      <path d="M8 15h2" />
      <path d="M17 15h1" />
      <path d="M17 18h1" />
      <path d="M2 21h20" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 19 6v5c0 4.6-2.7 8.1-7 10-4.3-1.9-7-5.4-7-10V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="8"
        cy="15"
        r="4"
      />

      <path d="m11 12 9-9" />
      <path d="m15 8 2 2" />
      <path d="m18 5 2 2" />
    </svg>
  );
}

function VerificationIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 19 6v5c0 4.6-2.7 8.1-7 10-4.3-1.9-7-5.4-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-9" />
    </svg>
  );
}