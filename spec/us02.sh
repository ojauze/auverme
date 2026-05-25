#!/usr/bin/env bash
# Spec: US-02 — Voir le site en local

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
echo "US-02 — Voir le site en local"
echo "──────────────────────────────"

# Critère 1 : git clone est documenté
check "La commande 'git clone' est documentée" \
  "$( grep -q 'git clone' "$README" && echo true || echo false )"

# Critère 2 : npm install est documenté
check "La commande 'npm install' est documentée" \
  "$( grep -q 'npm install' "$README" && echo true || echo false )"

# Critère 3 : npm run dev et l'URL localhost:4321 sont mentionnés
check "La commande 'cd auverme' est documentée" \
  "$( grep -q 'cd auverme' "$README" && echo true || echo false )"

check "La commande 'npm run dev' est documentée" \
  "$( grep -q 'npm run dev' "$README" && echo true || echo false )"

check "L'URL localhost:4321 est mentionnée" \
  "$( grep -q 'localhost:4321' "$README" && echo true || echo false )"

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
