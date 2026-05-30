#!/usr/bin/env bash
# Spec: US-25 — Composants réutilisables (Section, Container, Button)

ROOT="${ROOT:-$(dirname "$0")/..}"
COMP="$ROOT/src/components"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-25 — Composants réutilisables"
echo "───────────────────────────────────"

check "Section.astro existe" \
  "$( [ -f "$COMP/Section.astro" ] && echo true || echo false )"

check "Container.astro existe" \
  "$( [ -f "$COMP/Container.astro" ] && echo true || echo false )"

check "Button.astro existe" \
  "$( [ -f "$COMP/Button.astro" ] && echo true || echo false )"

check "Button.astro accepte une prop href (variant lien)" \
  "$( grep -q 'href' "$COMP/Button.astro" 2>/dev/null && echo true || echo false )"

check "Button.astro accepte une prop variant (primary/secondary/outline)" \
  "$( grep -q 'variant' "$COMP/Button.astro" 2>/dev/null && echo true || echo false )"

check "Section.astro accepte une prop title" \
  "$( grep -q 'title' "$COMP/Section.astro" 2>/dev/null && echo true || echo false )"

check "Container.astro définit une largeur max" \
  "$( grep -q 'max-width\|maxWidth' "$COMP/Container.astro" 2>/dev/null && echo true || echo false )"

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
