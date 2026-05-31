#!/usr/bin/env bash
# Spec: US-26 — Page standalone « Site en cours de construction »

ROOT="${ROOT:-$(dirname "$0")/..}"
PAGE="$ROOT/src/pages/construction.astro"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-26 — Page « Site en cours de construction »"
echo "─────────────────────────────────────────────────"

check "src/pages/construction.astro existe" \
  "$( [ -f "$PAGE" ] && echo true || echo false )"

check "La page contient le nom du cabinet (Fredoka / font-display)" \
  "$( grep -q 'font-display\|Fredoka' "$PAGE" 2>/dev/null && echo true || echo false )"

check "La page contient un lien de contact (mailto ou /contact)" \
  "$( grep -q 'mailto\|/contact' "$PAGE" 2>/dev/null && echo true || echo false )"

check "La page utilise les tokens CSS du design system (--color-brand)" \
  "$( grep -q '\-\-color-brand' "$PAGE" 2>/dev/null && echo true || echo false )"

check "La page n'importe pas de ressource externe supplémentaire" \
  "$( ! grep -q '@import url' "$PAGE" 2>/dev/null && echo true || echo false )"

check "La page N'importe PAS le Layout principal (standalone)" \
  "$( ! grep -q 'import Layout' "$PAGE" 2>/dev/null && echo true || echo false )"

check "La page a un <title> et une meta description" \
  "$( grep -q '<title>' "$PAGE" 2>/dev/null && grep -q 'description' "$PAGE" 2>/dev/null && echo true || echo false )"

check "index.astro est inchangé (home non remplacée)" \
  "$( grep -q 'hero\|Hero' "$ROOT/src/pages/index.astro" 2>/dev/null && echo true || echo false )"

# Build passe
echo ""
echo "  ⏳ Test du build Astro..."
BUILD_OUT=$(cd "$ROOT" && npm run build 2>&1)
BUILD_OK=$( echo "$BUILD_OUT" | grep -q "Complete" && echo true || echo false )
check "npm run build passe sans erreur" "$BUILD_OK"
[ "$BUILD_OK" = "false" ] && echo "$BUILD_OUT" | tail -10

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
