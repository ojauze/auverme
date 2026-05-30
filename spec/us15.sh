#!/usr/bin/env bash
# Spec: US-15 — Tailwind CSS v4 + unplugin-icons + Biome

ROOT="${ROOT:-$(dirname "$0")/..}"
PKG="$ROOT/package.json"
CFG="$ROOT/astro.config.mjs"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-15 — Stack technique (Tailwind v4 + icons + Biome)"
echo "───────────────────────────────────────────────────────"

# Dépendances installées
check "tailwindcss v4 installé" \
  "$( node -e "require('$ROOT/node_modules/tailwindcss/package.json')" 2>/dev/null && \
     node -e "const v=require('$ROOT/node_modules/tailwindcss/package.json').version; process.exit(v.startsWith('4')?0:1)" 2>/dev/null && echo true || echo false )"

check "@tailwindcss/vite installé" \
  "$( [ -d "$ROOT/node_modules/@tailwindcss/vite" ] && echo true || echo false )"

check "tailwind-variants installé" \
  "$( [ -d "$ROOT/node_modules/tailwind-variants" ] && echo true || echo false )"

check "tailwind-merge installé" \
  "$( [ -d "$ROOT/node_modules/tailwind-merge" ] && echo true || echo false )"

check "@tailwindplus/elements installé" \
  "$( [ -d "$ROOT/node_modules/@tailwindplus" ] && echo true || echo false )"

check "unplugin-icons installé" \
  "$( [ -d "$ROOT/node_modules/unplugin-icons" ] && echo true || echo false )"

check "@iconify/json installé" \
  "$( [ -d "$ROOT/node_modules/@iconify/json" ] && echo true || echo false )"

check "@tailwindcss/typography installé" \
  "$( [ -d "$ROOT/node_modules/@tailwindcss/typography" ] && echo true || echo false )"

check "@biomejs/biome installé" \
  "$( [ -d "$ROOT/node_modules/@biomejs/biome" ] && echo true || echo false )"

# astro.config.mjs mis à jour
check "astro.config.mjs importe @tailwindcss/vite" \
  "$( grep -q '@tailwindcss/vite' "$CFG" && echo true || echo false )"

check "astro.config.mjs importe unplugin-icons" \
  "$( grep -q 'unplugin-icons' "$CFG" && echo true || echo false )"

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
