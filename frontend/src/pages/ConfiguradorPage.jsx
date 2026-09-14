import {
  Configurator,
} from "../components/configurator/Configurator";

export function ConfiguradorPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_14%,#edf5f8_38%,#e2eef3_62%,#edf5f8_82%,#ffffff_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-44 top-[12%] h-[420px] w-[420px] rounded-full bg-[#65b8ee]/[0.065] blur-[135px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-52 top-[38%] h-[500px] w-[500px] rounded-full bg-[#12364e]/[0.045] blur-[150px]"
        />

        <Configurator />
      </div>
    </main>
  );
}