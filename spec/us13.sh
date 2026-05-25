#!/usr/bin/env bash
# Spec: US-13 — Nom de domaine personnalisé

REPO_ROOT="${REPO_ROOT:-$(dirname "$0")/..}"
DOMAIN="auverme-orthopedagogie.fr"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-13 — Nom de domaine personnalisé"
echo "─────────────────────────────────────"

# Critère 1 : fichier public/CNAME existe et contient le bon domaine
CNAME="$REPO_ROOT/public/CNAME"
check "Le fichier public/CNAME existe" \
  "$( [ -f "$CNAME" ] && echo true || echo false )"
check "public/CNAME contient '$DOMAIN'" \
  "$( grep -q "$DOMAIN" "$CNAME" 2>/dev/null && echo true || echo false )"

# Critère 2 : astro.config.mjs utilise le bon site et n'a plus de base /auverme
CONFIG="$REPO_ROOT/astro.config.mjs"
check "astro.config.mjs référence 'https://$DOMAIN'" \
  "$( grep -q "https://$DOMAIN" "$CONFIG" && echo true || echo false )"
check "astro.config.mjs n'a plus de 'base: auverme' (cause 404 avec domaine perso)" \
  "$( ! grep -q "base:.*auverme" "$CONFIG" && echo true || echo false )"

# Critère 3 : le domaine est configuré dans GitHub Pages
GH_DOMAIN=$(gh api repos/ojauze/auverme/pages --jq '.cname' 2>/dev/null)
check "GitHub Pages a '$DOMAIN' comme domaine personnalisé (actuel: ${GH_DOMAIN:-aucun})" \
  "$( [ "$GH_DOMAIN" = "$DOMAIN" ] && echo true || echo false )"

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
