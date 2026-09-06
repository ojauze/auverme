# Runbook — Synchronisation Instagram

Procédure de diagnostic et de réparation du pipeline qui publie les posts
Instagram sur le site.

Dernière panne traitée : **4 septembre 2026** (révocation d'autorisation).

---

## 1. Comment ça marche

```
Instagram Graph API
       │
       │  sync-instagram.yml   (quotidien, cron 7h UTC)
       ▼
scripts/sync-instagram.py
       │  écrit  src/content/instagram/{shortcode}.md
       │  écrit  public/images/instagram/{shortcode}.jpg
       ▼
   commit [bot] sur main
       │
       │  deploy.yml  (workflow_run, après le sync)
       ▼
   GitHub Pages → auverme-orthopedagogie.fr/actualites/
```

Un second workflow, `refresh-instagram-token.yml`, tourne le 1er de chaque
mois et renouvelle le token Instagram avant qu'il n'expire.

> **Note sur l'horaire.** Le cron est réglé sur 7h UTC mais GitHub décale
> systématiquement les workflows planifiés de 3 à 5 heures. Les runs partent
> en pratique entre 10h et 12h UTC. Ce n'est pas un dysfonctionnement.

### Identifiants

| | Valeur |
|---|---|
| Dépôt | `ojauze/auverme` |
| Meta App ID (URL du dashboard) | `2939286963080461` |
| Instagram App ID (dans les messages d'erreur) | `1052315293970848` |
| Instagram user ID | `28119297107674296` |
| Compte Instagram | `auvermeorthopedagogie` |
| Endpoint | `https://graph.instagram.com/v21.0/me/media` |

⚠️ **Les deux App ID sont différents et c'est normal.** L'API renvoie
l'*Instagram* App ID dans ses erreurs, mais l'URL du dashboard Meta utilise le
*Meta* App ID. Construire une URL avec celui de l'erreur mène à une page
introuvable.

### Secrets GitHub

[Settings → Secrets → Actions](https://github.com/ojauze/auverme/settings/secrets/actions)

| Secret | Rôle | Durée de vie |
|---|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | Lecture de l'API Instagram | 60 jours, renouvelé automatiquement |
| `PAT_SECRETS_WRITE` | Permet au workflow d'écrire le secret ci-dessus | Selon l'expiration choisie |

---

## 2. Diagnostic

Commencer par lire l'erreur réelle :

```bash
gh run list --workflow=sync-instagram.yml --limit 5
gh run view <run-id> --log-failed
```

| Message | Cause | Aller à |
|---|---|---|
| `The user has not authorized application` | Autorisation révoquée côté Instagram | [Procédure A](#procédure-a--ré-autoriser-instagram) |
| `Error validating access token` / `expired` | Token expiré (le refresh n'a pas tourné) | [Procédure A](#procédure-a--ré-autoriser-instagram) |
| `failed to fetch public key: HTTP 401: Bad credentials` | PAT expiré ou permissions insuffisantes | [Procédure B](#procédure-b--renouveler-le-pat-github) |
| `Aucun nouveau post à synchroniser` | Aucune erreur — rien de neuf sur Instagram | — |

Pour vérifier si l'autorisation a été révoquée et **quand**, côté Instagram :
*Paramètres → Applications et sites Web → onglet **Supprimé***. L'app
`auverme-IG` y apparaît avec sa date de suppression.

---

## Procédure A — Ré-autoriser Instagram

C'est la panne récurrente. Compter deux minutes.

**1. Ouvrir le cas d'utilisation**

<https://developers.facebook.com/apps/2939286963080461/>

Menu de gauche → **Cas d'utilisation** → **« Gérer les messages et les
contenus sur Instagram »**

> Il n'y a **pas** de produit « Instagram » dans le menu de gauche. Ce
> dashboard est organisé par cas d'usage, pas par produit — la configuration
> Instagram est à l'intérieur du cas d'utilisation.

**2. Générer le token**

Dans la section de génération de token, en face du compte
`auvermeorthopedagogie` → **Generate token**.

Une popup s'ouvre (l'autoriser si le navigateur la bloque) :
- se connecter avec le **compte Instagram**, pas Facebook
- cliquer **Autoriser**

👉 C'est ce clic qui rétablit l'autorisation révoquée.

Copier le token affiché (`IGAA…`, ~160 caractères).

**3. Vérifier le rôle de testeur**

Menu de gauche → **Rôles dans l'application**. Le compte doit y figurer comme
testeur, invitation acceptée. Si elle est en attente, l'accepter depuis
Instagram : *Applications et sites Web → onglet **Invitations à tester***.

**4. Enregistrer**

[Secrets → Actions](https://github.com/ojauze/auverme/settings/secrets/actions)
→ `INSTAGRAM_ACCESS_TOKEN` → **Update**

**5. Vérifier**

```bash
gh workflow run sync-instagram.yml
```

Attendre environ une minute, puis consulter le run. Le résultat attendu
ressemble à :

```
📥 Fetching up to 20 posts for user 28119297107674296…
   Found 20 posts. 30 already synced.
```

---

## Procédure B — Renouveler le PAT GitHub

Sans ce token, le renouvellement automatique du token Instagram échoue et il
faut refaire la procédure A à la main tous les 60 jours.

**1. Créer le token**

<https://github.com/settings/personal-access-tokens/new>

| Champ | Valeur |
|---|---|
| Token name | `auverme-secrets-write` |
| Resource owner | `ojauze` |
| Expiration | **1 an** (recommandé — GitHub envoie un rappel avant échéance) |
| Repository access | *Only select repositories* → `ojauze/auverme` |

**Repository permissions** → chercher **`Secrets`** → **Read and write**.

C'est la seule permission à activer. `Metadata: Read-only` s'ajoute
automatiquement, c'est normal. Ne pas confondre avec les entrées voisines
*Environments*, *Variables* ou *Dependabot secrets*.

**2. Enregistrer**

Copier la valeur (`github_pat_…`, affichée une seule fois) →
[Secrets → Actions](https://github.com/ojauze/auverme/settings/secrets/actions)
→ `PAT_SECRETS_WRITE` → **Update**

**3. Vérifier**

```bash
gh workflow run refresh-instagram-token.yml
```

Attendu : `✅ Token renouvelé et secret mis à jour.` Le workflow valide le
nouveau token contre l'API **avant** de l'enregistrer, donc un succès prouve
que toute la chaîne fonctionne.

Confirmer que le secret a bien été réécrit :

```bash
gh secret list
```

La date de `INSTAGRAM_ACCESS_TOKEN` doit correspondre à l'instant du run.

---

## 3. Pourquoi la panne se reproduit

L'app Meta est en mode **développement** (`Publier — Non publiée` sur le
tableau de bord). Une app non publiée ne peut être autorisée que par des
comptes ayant un **rôle de testeur**, et ces autorisations expirent.

C'est ce que reflètent les onglets *Actif / Expiré / Supprimé / Invitations à
tester* côté Instagram.

Historique observé :

| Date | Événement |
|---|---|
| 11 juillet 2026 | Autorisation supprimée |
| 4 septembre 2026 | Autorisation supprimée |

Soit environ huit semaines d'intervalle. **Ce n'est pas un incident, c'est le
cycle de vie normal d'une autorisation de testeur.** Prévoir une récurrence.

### S'en affranchir

Publier l'app supprimerait ces révocations périodiques, mais impose de passer
le **Contrôle app** de Meta pour obtenir l'accès avancé aux permissions
Instagram : description de l'usage, vidéo du parcours, politique de
confidentialité (déjà en ligne sur le site).

Pour un site vitrine qui lit ses propres publications, le coût dépasse
probablement le bénéfice. Refaire la procédure A tous les deux mois reste
raisonnable.

---

## 4. Notes pour qui modifierait les workflows

Le dépôt est **public** : les logs d'exécution des workflows le sont aussi.

Une version antérieure de `refresh-instagram-token.yml` passait le token par
une interpolation `${{ }}` dans un script `run`. GitHub substitue ces
expressions *avant* l'exécution et recopie le script complet dans le log — le
token s'est retrouvé en clair dans les logs publics. Les protections
actuelles, à conserver :

- le refresh et l'écriture du secret sont faits **dans une seule étape**, pour
  qu'aucun token ne transite en sortie d'étape ;
- `::add-mask::` est appliqué dès l'extraction du token ;
- la valeur est passée à `gh secret set` **par stdin**, jamais en argument
  (`--body-file` n'existe pas ; sans `--body`, la commande lit stdin) ;
- en cas d'échec, seul `error.message` est affiché, jamais la réponse brute de
  l'API qui contient le token.

Un workflow planifié ne s'exécute qu'à sa date : après toute modification,
le déclencher manuellement avec `gh workflow run` plutôt que d'attendre le
cron.
