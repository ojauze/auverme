#!/usr/bin/env bash
# Spec: US-23 — Page Services

ROOT="${ROOT:-$(dirname "$0")/..}"
PAGE="$ROOT/src/pages/articles.astro"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-23 — Page Services"
echo "───────────────────────"

check "articles.astro utilise Section ou Container" \
  "$( grep -q 'Section\|Container' "$PAGE" 2>/dev/null && echo true || echo false )"

check "articles.astro a un titre h1" \
  "$( grep -q '<h1' "$PAGE" 2>/dev/null && echo true || echo false )"

check "articles.astro liste au moins un service (carte/item)" \
  "$( grep -qi 'service\|bilan\|accompagnement\|dyslexie' "$PAGE" 2>/dev/null && echo true || echo false )"

check "articles.astro indique le déroulement / tarifs ou infos pratiques" \
  "$( grep -qi 'tarif\|séance\|durée\|déroulement\|pratique' "$PAGE" 2>/dev/null && echo true || echo false )"

check "articles.astro contient un CTA vers Contact" \
  "$( grep -q '/contact' "$PAGE" 2>/dev/null && echo true || echo false )"

check "articles.astro utilise Button" \
  "$( grep -q 'Button' "$PAGE" 2>/dev/null && echo true || echo false )"

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
