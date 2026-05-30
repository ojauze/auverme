#!/usr/bin/env bash
# Spec: US-18 — Layout.astro refactorisé (SEO, OG tags, --header-height)

ROOT="${ROOT:-$(dirname "$0")/..}"
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
echo "US-18 — Layout.astro (SEO, OG tags, --header-height)"
echo "───────────────────────────────────────────────────────"

# Importe siteConfig
check "Layout.astro importe siteConfig" \
  "$( grep -q 'siteConfig' "$LAYOUT" 2>/dev/null && echo true || echo false )"

# Meta description dynamique
check "Layout.astro a une meta description" \
  "$( grep -q 'name="description"' "$LAYOUT" 2>/dev/null && echo true || echo false )"

# OG tags (og:title, og:description, og:url)
check "Layout.astro a des OG tags (og:title)" \
  "$( grep -q 'og:title' "$LAYOUT" 2>/dev/null && echo true || echo false )"

check "Layout.astro a des OG tags (og:description)" \
  "$( grep -q 'og:description' "$LAYOUT" 2>/dev/null && echo true || echo false )"

# Canonical URL
check "Layout.astro a un lien canonical" \
  "$( grep -q 'canonical' "$LAYOUT" 2>/dev/null && echo true || echo false )"

# Variable CSS --header-height
check "Layout.astro définit --header-height" \
  "$( grep -q '\-\-header-height' "$LAYOUT" 2>/dev/null && echo true || echo false )"

# lang="fr"
check "Layout.astro a lang=\"fr\"" \
  "$( grep -q 'lang="fr"' "$LAYOUT" 2>/dev/null && echo true || echo false )"

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
