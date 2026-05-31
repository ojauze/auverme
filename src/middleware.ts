import { defineMiddleware } from "astro:middleware";

/**
 * Protège l'accès à Keystatic CMS par HTTP Basic Auth.
 *
 * Configuration : définir KEYSTATIC_PASSWORD dans .env.local
 * (ce fichier est exclu du git).
 *
 * Si la variable n'est pas définie → 403 (accès refusé sans pop-up navigateur).
 * Si le mot de passe est incorrect → 401 (le navigateur redemande).
 * Toutes les autres routes passent sans vérification.
 */

const PROTECTED_PREFIXES = ["/keystatic", "/api/keystatic"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );

  if (!isProtected) return next();

  // Refuser si aucun mot de passe n'est configuré
  const storedPassword = import.meta.env.KEYSTATIC_PASSWORD;
  if (!storedPassword) {
    return new Response("Keystatic: KEYSTATIC_PASSWORD non configuré.", {
      status: 403,
    });
  }

  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return new Response("Authentification requise.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Keystatic CMS"' },
    });
  }

  // Basic Auth format : "username:password" (on accepte n'importe quel username)
  const credentials = atob(authHeader.slice("Basic ".length));
  const colonIdx = credentials.indexOf(":");
  const password = colonIdx >= 0 ? credentials.slice(colonIdx + 1) : credentials;

  if (password !== storedPassword) {
    return new Response("Mot de passe incorrect.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Keystatic CMS"' },
    });
  }

  return next();
});
