#!/usr/bin/env bash
# Spec: US-24 — Blog / Actualités (content collection Markdown)

ROOT="${ROOT:-$(dirname "$0")/..}"
ACTUS="$ROOT/src/pages/actualites.astro"
CONTENT="$ROOT/src/content"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-24 — Actualités (content collection Markdown)"
echo "───────────────────────────────────────────────────"

# Répertoire content/actualites
check "src/content/actualites/ existe" \
  "$( [ -d "$CONTENT/actualites" ] && echo true || echo false )"

# Au moins un article Markdown
check "Au moins un article .md dans src/content/actualites/" \
  "$( ls "$CONTENT/actualites"/*.md 2>/dev/null | grep -q . && echo true || echo false )"

# config.ts de la collection
check "src/content/config.ts définit la collection 'actualites'" \
  "$( grep -q 'actualites' "$CONTENT/config.ts" 2>/dev/null && echo true || echo false )"

# Frontmatter : title, date, description
check "L'article a un frontmatter title et date" \
  "$( grep -q 'title:' "$CONTENT/actualites"/*.md 2>/dev/null && \
      grep -q 'date:' "$CONTENT/actualites"/*.md 2>/dev/null && echo true || echo false )"

# actualites.astro utilise getCollection
check "actualites.astro utilise getCollection" \
  "$( grep -q 'getCollection' "$ACTUS" 2>/dev/null && echo true || echo false )"

# actualites.astro affiche les articles
check "actualites.astro affiche titre et date des articles" \
  "$( grep -q 'title\|date' "$ACTUS" 2>/dev/null && echo true || echo false )"

# Page de détail dynamique
check "src/pages/actualites/[slug].astro existe" \
  "$( [ -f "$ROOT/src/pages/actualites/[slug].astro" ] && echo true || echo false )"

# Build passe
echo ""
echo "  ⏳ Test du build Astro..."
BUILD_OUT=$(cd "$ROOT" && npm run build 2>&1)
BUILD_OK=$( echo "$BUILD_OUT" | grep -q "Complete" && echo true || echo false )
check "npm run build passe sans erreur" "$BUILD_OK"
[ "$BUILD_OK" = "false" ] && echo "$BUILD_OUT" | tail -20

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
