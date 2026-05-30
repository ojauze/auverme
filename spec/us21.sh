#!/usr/bin/env bash
# Spec: US-21 — Page d'accueil (Hero, Stats, Services, Témoignages, FAQ)

ROOT="${ROOT:-$(dirname "$0")/..}"
INDEX="$ROOT/src/pages/index.astro"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-21 — Page d'accueil (Hero, Stats, Services, FAQ)"
echo "──────────────────────────────────────────────────────"

# Section Hero
check "index.astro contient une section Hero" \
  "$( grep -qi 'hero\|Hero' "$INDEX" 2>/dev/null && echo true || echo false )"

check "Hero contient un titre h1" \
  "$( grep -q '<h1' "$INDEX" 2>/dev/null && echo true || echo false )"

check "Hero contient un CTA principal" \
  "$( grep -q 'Prendre RDV\|rendez-vous\|contact' "$INDEX" 2>/dev/null && echo true || echo false )"

# Section Stats
check "index.astro contient des statistiques/chiffres clés" \
  "$( grep -qi 'stat\|chiffre\|ans d' "$INDEX" 2>/dev/null && echo true || echo false )"

# Section Services
check "index.astro contient une section Services" \
  "$( grep -qi 'service\|Service\|accompagnement' "$INDEX" 2>/dev/null && echo true || echo false )"

# Section FAQ
check "index.astro contient une section FAQ" \
  "$( grep -qi 'faq\|FAQ\|question' "$INDEX" 2>/dev/null && echo true || echo false )"

# Utilise les composants réutilisables
check "index.astro utilise Section ou Container" \
  "$( grep -q 'Section\|Container' "$INDEX" 2>/dev/null && echo true || echo false )"

# Utilise Button
check "index.astro utilise Button" \
  "$( grep -q 'Button' "$INDEX" 2>/dev/null && echo true || echo false )"

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
