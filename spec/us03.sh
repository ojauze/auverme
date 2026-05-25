#!/usr/bin/env bash
# Spec: US-03 — Construire le site

README="${README:-$(dirname "$0")/../README.md}"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-03 — Construire le site"
echo "───────────────────────────"

# Critère 1 : npm run build est documenté
check "La commande 'npm run build' est documentée" \
  "$( grep -q 'npm run build' "$README" && echo true || echo false )"

# Critère 2 : le dossier de sortie dist/ est mentionné
check "Le dossier de sortie 'dist/' est mentionné" \
  "$( grep -q 'dist/' "$README" && echo true || echo false )"

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
