#!/usr/bin/env bash
# Spec: US-17 — Données centralisées dans src/data/config.ts

ROOT="${ROOT:-$(dirname "$0")/..}"
CFG="$ROOT/src/data/config.ts"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-17 — Données centralisées (src/data/config.ts)"
echo "────────────────────────────────────────────────────"

# Fichier existe
check "src/data/config.ts existe" \
  "$( [ -f "$CFG" ] && echo true || echo false )"

# Exporte siteConfig
check "config.ts exporte siteConfig" \
  "$( grep -q 'export.*siteConfig' "$CFG" 2>/dev/null && echo true || echo false )"

# Contient le nom du site
check "siteConfig contient name" \
  "$( grep -q 'name:' "$CFG" 2>/dev/null && echo true || echo false )"

# Contient l'URL
check "siteConfig contient url" \
  "$( grep -q 'url:' "$CFG" 2>/dev/null && echo true || echo false )"

# Contient les infos de contact (email ou téléphone)
check "siteConfig contient contact" \
  "$( grep -q 'contact' "$CFG" 2>/dev/null && echo true || echo false )"

# Contient la navigation (nav links)
check "config.ts exporte navLinks" \
  "$( grep -q 'navLinks\|navigation' "$CFG" 2>/dev/null && echo true || echo false )"

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
