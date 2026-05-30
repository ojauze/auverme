#!/usr/bin/env bash
# Spec: US-16 — Design system (Nunito + Fredoka, tokens CSS, couleurs de marque)

ROOT="${ROOT:-$(dirname "$0")/..}"
CSS="$ROOT/src/styles/global.css"
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
echo "US-16 — Design system (Nunito + Fredoka, tokens CSS)"
echo "──────────────────────────────────────────────────────"

# Fichier global.css existe
check "src/styles/global.css existe" \
  "$( [ -f "$CSS" ] && echo true || echo false )"

# global.css importe tailwindcss
check "global.css importe tailwindcss" \
  "$( grep -q '@import "tailwindcss"' "$CSS" 2>/dev/null && echo true || echo false )"

# Tokens de couleur définis dans @theme
check "global.css définit --color-brand-* dans @theme" \
  "$( grep -q '\-\-color-brand' "$CSS" 2>/dev/null && echo true || echo false )"

# Police Nunito chargée
check "global.css charge la police Nunito" \
  "$( grep -q 'Nunito' "$CSS" 2>/dev/null && echo true || echo false )"

# Police Fredoka chargée
check "global.css charge la police Fredoka" \
  "$( grep -q 'Fredoka' "$CSS" 2>/dev/null && echo true || echo false )"

# Layout.astro importe global.css
check "Layout.astro importe global.css" \
  "$( grep -q 'global.css' "$LAYOUT" 2>/dev/null && echo true || echo false )"

# Layout.astro n'a plus de <style is:global> inline (migré dans global.css)
check "Layout.astro n'a plus de styles globaux inline" \
  "$( ! grep -q 'is:global' "$LAYOUT" 2>/dev/null && echo true || echo false )"

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
