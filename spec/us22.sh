#!/usr/bin/env bash
# Spec: US-22 — Page À propos

ROOT="${ROOT:-$(dirname "$0")/..}"
PAGE="$ROOT/src/pages/a-propos.astro"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-22 — Page À propos"
echo "───────────────────────"

check "a-propos.astro utilise Section ou Container" \
  "$( grep -q 'Section\|Container' "$PAGE" 2>/dev/null && echo true || echo false )"

check "a-propos.astro a un titre h1" \
  "$( grep -q '<h1' "$PAGE" 2>/dev/null && echo true || echo false )"

check "a-propos.astro présente le parcours / la formation" \
  "$( grep -qi 'parcours\|formation\|diplôme\|cursus' "$PAGE" 2>/dev/null && echo true || echo false )"

check "a-propos.astro présente la philosophie / l'approche" \
  "$( grep -qi 'philosophie\|approche\|valeur\|vision\|engag' "$PAGE" 2>/dev/null && echo true || echo false )"

check "a-propos.astro contient un CTA vers Contact" \
  "$( grep -q '/contact' "$PAGE" 2>/dev/null && echo true || echo false )"

check "a-propos.astro utilise Button" \
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
