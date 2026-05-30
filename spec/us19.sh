#!/usr/bin/env bash
# Spec: US-19 — Header refactorisé (glassmorphism, logo Fredoka, menu mobile)

ROOT="${ROOT:-$(dirname "$0")/..}"
NAV="$ROOT/src/components/Nav.astro"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-19 — Header (glassmorphism, Fredoka logo, mobile menu)"
echo "────────────────────────────────────────────────────────────"

# Importe navLinks depuis config
check "Nav.astro importe navLinks depuis config" \
  "$( grep -q 'navLinks' "$NAV" 2>/dev/null && echo true || echo false )"

# Logo utilise la font Fredoka
check "Logo applique font-display / Fredoka" \
  "$( grep -q 'font-display\|Fredoka\|font-family.*display' "$NAV" 2>/dev/null && echo true || echo false )"

# Effet glassmorphism (backdrop-filter)
check "Header a un effet glassmorphism (backdrop-filter)" \
  "$( grep -q 'backdrop-filter\|backdrop' "$NAV" 2>/dev/null && echo true || echo false )"

# Sticky / fixed
check "Header est sticky ou fixed" \
  "$( grep -q 'sticky\|fixed' "$NAV" 2>/dev/null && echo true || echo false )"

# Hamburger présent
check "Bouton hamburger présent" \
  "$( grep -q 'hamburger' "$NAV" 2>/dev/null && echo true || echo false )"

# Menu mobile présent
check "Menu mobile présent" \
  "$( grep -q 'mobile-menu\|mobileMenu\|mobile_menu' "$NAV" 2>/dev/null && echo true || echo false )"

# Aria attributes
check "Navigation a des attributs aria" \
  "$( grep -q 'aria-' "$NAV" 2>/dev/null && echo true || echo false )"

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
