#!/usr/bin/env bash
# Spec: US-01 — Comprendre le projet

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
echo "US-01 — Comprendre le projet"
echo "────────────────────────────"

# Critère 1 : un paragraphe de description existe juste après le titre H1
desc=$(awk '/^# /{found=1;next} found && /^[^#\[]/ && NF{print;exit}' "$README")
check "Un paragraphe de description suit le titre H1" \
  "$( [ -n "$desc" ] && echo true || echo false )"

# Critère 2 : le public cible est mentionné
public=$(grep -iE "orthopédagogue|parents|enfants|élèves|familles|apprentissage|difficultés" "$README")
check "Le public cible est mentionné" \
  "$( [ -n "$public" ] && echo true || echo false )"

# Critère 3 : le bloc de description tient en 5 lignes ou moins
lines=$(awk '/^# /{f=1;next} f&&/^## /{exit} f&&NF{c++} END{print c+0}' "$README")
check "La description tient en ≤ 5 lignes (actuel : ${lines})" \
  "$( [ "$lines" -le 5 ] && echo true || echo false )"

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
