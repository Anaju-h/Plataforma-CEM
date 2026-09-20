// Reexport mantido para preservar os imports existentes do configurador.
// A fonte única do catálogo fica em src/data/serviceCatalog.js.
export {
  commercialServiceOrder,
  directServiceOrder,
  DIRECT_SERVICE_OPTIONS,
  getCandidateMachines,
  getService,
  getServiceLabel,
  normalizeServiceId,
  serviceCatalog,
  serviceOrder,
  SERVICE_OPTIONS,
  technicalServiceOrder,
  TECHNICAL_SERVICE_OPTIONS,
} from "../../../data/serviceCatalog";