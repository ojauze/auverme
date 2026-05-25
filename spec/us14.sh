#!/usr/bin/env bash
# Spec: US-14 — Page Contact

PAGE="${PAGE:-$(dirname "$0")/../src/pages/contact.astro}"
NAV="${NAV:-$(dirname "$0")/../src/components/Nav.astro}"
PASS=0; FAIL=0

check() {
  if [ "$2" = "true" ]; then
    echo "  ✓ $1"; PASS=$((PASS+1))
  else
    echo "  ✗ $1"; FAIL=$((FAIL+1))
  fi
}

echo ""
echo "US-14 — Page Contact"
echo "─────────────────────"

# Critère 1 : formulaire présent avec les champs nom, email, téléphone, message
check "Champ 'nom' présent dans le formulaire" \
  "$( grep -qi 'name="nom"\|name="name"\|type="text"' "$PAGE" && echo true || echo false )"
check "Champ 'email' présent dans le formulaire" \
  "$( grep -qi 'type="email"' "$PAGE" && echo true || echo false )"
check "Champ 'téléphone' présent dans le formulaire" \
  "$( grep -qi 'type="tel"\|téléphone\|telephone' "$PAGE" && echo true || echo false )"
check "Champ 'message' (textarea) présent dans le formulaire" \
  "$( grep -qi '<textarea' "$PAGE" && echo true || echo false )"

# Critère 2 : le champ téléphone est optionnel (pas d'attribut required)
check "Le champ téléphone est optionnel (pas de 'required')" \
  "$( ! grep -i 'type="tel"' "$PAGE" | grep -qi 'required' && echo true || echo false )"

# Critère 3 : message de confirmation après envoi
check "Un message de confirmation est prévu après envoi" \
  "$( grep -qi 'confirmation\|merci\|envoyé\|succès\|bien reçu' "$PAGE" && echo true || echo false )"

# Critère 4 : zone géographique mentionnée
check "La zone géographique est mentionnée (Bordeaux)" \
  "$( grep -qi 'bordeaux' "$PAGE" && echo true || echo false )"

# Critère 5 : modalités présentiel + visio mentionnées
check "Les modalités de consultation sont précisées (visio)" \
  "$( grep -qi 'visio\|télé\|distance\|domicile' "$PAGE" && echo true || echo false )"

# Critère 6 : délai de réponse affiché
check "Un délai de réponse est indiqué (48h)" \
  "$( grep -qi '48h\|48 h\|deux jours\|réponse' "$PAGE" && echo true || echo false )"

# Critère 7 : lien /contact dans la navigation
check "Le lien /contact est présent dans la navigation" \
  "$( grep -qi '/contact' "$NAV" && echo true || echo false )"

echo ""
echo "Résultat : ${PASS} ✓  ${FAIL} ✗"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
