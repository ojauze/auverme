#!/usr/bin/env bash
# Spec: US-04 — Déployer le site

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
echo "US-04 — Déployer le site"
echo "─────────────────────────"

# Critère 1 : GitHub Pages est mentionné
check "La plateforme d'hébergement (GitHub Pages) est mentionnée" \
  "$( grep -qi 'github pages' "$README" && echo true || echo false )"

# Critère 2 : le déclencheur push sur main est documenté
check "Le déclencheur 'push sur main' est documenté" \
  "$( grep -qE 'push.*(sur |on )?main|main.*push' "$README" && echo true || echo false )"

# Critère 3 : un workflow GitHub Actions existe pour automatiser le déploiement
WORKFLOW_DIR="$(dirname "$0")/../.github/workflows"
check "Un fichier workflow GitHub Actions existe (.github/workflows/deploy.yml)" \
  "$( [ -f "$WORKFLOW_DIR/deploy.yml" ] && echo true || echo false )"

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
