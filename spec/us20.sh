#!/usr/bin/env bash
# Spec: US-20 — Footer component

ROOT="${ROOT:-$(dirname "$0")/..}"
FOOTER="$ROOT/src/components/Footer.astro"
LAYOUT="$ROOT/src/layouts/Layout.astro"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-20 — Footer component"
echo "──────────────────────────"

check "src/components/Footer.astro existe" \
  "$( [ -f "$FOOTER" ] && echo true || echo false )"

check "Footer.astro importe siteConfig" \
  "$( grep -q 'siteConfig' "$FOOTER" 2>/dev/null && echo true || echo false )"

check "Footer.astro contient l'email de contact" \
  "$( grep -q 'email\|contact' "$FOOTER" 2>/dev/null && echo true || echo false )"

check "Footer.astro contient la mention de la ville" \
  "$( grep -q 'Bordeaux\|city\|contact\.city' "$FOOTER" 2>/dev/null && echo true || echo false )"

check "Footer.astro contient les liens de navigation" \
  "$( grep -q 'navLinks\|href' "$FOOTER" 2>/dev/null && echo true || echo false )"

check "Footer.astro contient le copyright" \
  "$( grep -q 'copyright\|©\|&copy;' "$FOOTER" 2>/dev/null && echo true || echo false )"

check "Layout.astro importe Footer.astro" \
  "$( grep -q 'Footer' "$LAYOUT" 2>/dev/null && echo true || echo false )"

check "Layout.astro n'a plus de <footer> inline" \
  "$( ! grep -q '<footer>' "$LAYOUT" 2>/dev/null && echo true || echo false )"

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
