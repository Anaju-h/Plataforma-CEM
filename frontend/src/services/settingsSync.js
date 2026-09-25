import { hasRole } from "./authApi";
import { hydrateAdministration } from "./administrationService";
import { hydrateCommercialReferences } from "./pricingService";
import { getSettings } from "./settingsApi";

let hydratedFor = null;

/** Carrega as configurações persistidas antes de abrir o portal (somente Administrador as utiliza). */
export async function hydrateSettings(user) {
  if (!hasRole(user, "ADMIN") || hydratedFor === user.id) return;
  try {
    const settings = await getSettings();
    hydrateAdministration({ general: settings.general, rules: settings["attention-rules"] });
    hydrateCommercialReferences(settings["commercial-rate"]);
    hydratedFor = user.id;
  } catch (error) {
    console.error("[configurações] não foi possível carregar:", error.message);
  }
}
