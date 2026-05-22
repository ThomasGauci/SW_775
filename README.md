# SW 775 — Summoners War Companion

Application web multi-utilisateurs pour **Summoners War**, construite avec Angular 17 et NestJS. Toutes les fonctionnalités sont accessibles depuis un menu de navigation commun. Chaque compte applicatif possède ses propres données isolées.

---

## Fonctionnalités

### 📥 Import de compte *(disponible)*
Importez votre compte SW en chargeant le fichier JSON exporté via [SW Exporter](https://github.com/Xzandro/sw-exporter).

- Drag & drop ou sélection de fichier
- Parsing 100 % côté client (aucune donnée envoyée au serveur)
- Persistance dans le navigateur (localStorage scopé par compte)
- Résumé post-import : nombre de monstres, runes et artefacts
- Isolation multi-utilisateur : chaque compte app possède ses propres données SW

---

### ⚔️ Siege Tracker *(disponible)*
Outil de suivi des attaques en siège de guilde.

- **Nouvelle attaque** : sélection des équipes attaquante et défensive (3 monstres chacune) via un picker avec recherche, filtre par élément et par rareté naturelle
- **Historique** : liste chronologique de tous les combats enregistrés avec images des monstres et suppression
- **Statistiques** :
  - Taux de victoire global avec barre visuelle
  - Top monstres (usage, victoires, win rate) — toutes les données, pas de limite
  - Top équipes par composition
  - Tri cliquable sur toutes les colonnes (▲/▼)
  - Recherche/filtre par nom de monstre ou par équipe

---

### 🐉 Monstres *(disponible)*
Répertoire complet de tous vos monstres possédés.

- Grille de cartes avec image, nom, élément, étoiles de naissance et niveau actuel
- **Étoiles violettes** pour les monstres éveillés, dorées pour les non-éveillés
- Badge **✓** vert si toutes les compétences du monstre sont au niveau maximum
- Filtre par élément (Feu / Eau / Vent / Lumière / Ténèbres)
- Recherche par nom, tri par nom / niveau / nat / étoiles
- Images : base64 locales pour les 790 monstres du fichier source, CDN SWARFARM en fallback pour les autres (1107 images supplémentaires)

---

### 💎 Runes *(disponible)*
Tableau complet de toutes vos runes (inventaire + équipées).

- **Efficacité %** calculée selon la formule SWOP : somme des sous-stats (+ meule) divisée par les valeurs max théoriques d'une rune +15 Légendaire
  - 🟣 ≥ 100% · 🟢 ≥ 80% · 🔵 ≥ 60% · ⬛ < 60%
- Nom du monstre équipé (résolu depuis la base de données locale)
- Détection des runes ancestrales (Immémoriale)
- Indicateurs gemme (✦) et meule (+X) sur les sous-stats
- **Filtres** : slot (1–6), set, rang, équipée/inventaire, **stat spécifique** (HP / HP% / ATK / ATK% / DEF / DEF% / VIT / TC% / DTC% / RES% / PREC%)
- Tri par slot, set, niveau d'enchantement, rang ou efficacité

---

### 🔮 Artefacts *(disponible)*
Tableau complet de vos 1600+ artefacts.

- **Efficacité %** calculée par rapport aux valeurs max connues de chaque effet secondaire
- Nom du monstre équipé
- **Filtres** : type (Attribut / Archétype), élément, style (Attaque / Défense / Support / HP), équipé/inventaire, **effet secondaire spécifique**
- Tri par niveau d'enchantement, rang, type ou efficacité

---

## Stack technique

| Couche          | Technologie                              |
|-----------------|------------------------------------------|
| Frontend        | Angular 17, TypeScript, SCSS, Signals    |
| Backend         | NestJS 10, TypeScript                    |
| Base de données | PostgreSQL 16, TypeORM                   |
| Auth            | JWT (Passport.js), bcrypt                |
| Infra locale    | Docker, docker-compose                   |
| Données         | SWARFARM API (images CDN, IDs éveillés)  |

---

## Prérequis

- [Node.js v20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour PostgreSQL)

---

## Installation

### 1. Lancer PostgreSQL

```bash
docker-compose up -d postgres
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Édite .env si besoin (les valeurs par défaut correspondent au docker-compose)
npm install
npm run start:dev
# API disponible sur http://localhost:3000
```

### 3. Extraire et enrichir les données monstres *(une seule fois)*

```bash
# Extraction depuis le fichier HTML source
node scripts/extract-monsters.js
# → frontend/src/assets/data/monsters.json (971 monstres avec images base64)

# Récupération des monstres manquants depuis SWARFARM
node scripts/fetch-swarfarm-monsters.js
# → monsters-patch.json enrichi (946 entrées)

# Récupération des images CDN et des IDs éveillés
node scripts/fetch-swarfarm-images.js
# → monster-images.json (1107 URLs) + awaken-ids.json (1122 IDs)
```

> Ces trois commandes sont déjà jouées — les fichiers générés sont commités dans le dépôt.  
> À relancer uniquement si Com2US ajoute de nouveaux monstres.

### 4. Frontend

```bash
cd frontend
npm install
npm start
# App disponible sur http://localhost:4200
```

---

## Structure du projet

```
SW_775/
├── frontend/                   Angular 17 (standalone components, OnPush)
│   └── src/
│       ├── app/
│       │   ├── layout/         Navbar principale (MainLayoutComponent)
│       │   ├── pages/          import · siege · monsters · runes · artifacts
│       │   │                   login · register
│       │   ├── components/     battle-form · monster-picker · history · statistics
│       │   ├── core/
│       │   │   ├── constants/  sw-constants (sets, stats, effets, max values)
│       │   │   ├── guards/     authGuard
│       │   │   ├── interceptors/ bearer token
│       │   │   ├── pipes/      safeUrl
│       │   │   └── services/   auth · monster · sw-account · battle
│       │   └── models/         battle · monster · sw-account · user
│       └── assets/data/
│           ├── monsters.json         971 monstres (base64 WebP)
│           ├── monsters-patch.json   946 corrections/ajouts SWARFARM
│           ├── monster-images.json   1107 URLs CDN SWARFARM
│           └── awaken-ids.json       1122 IDs de formes éveillées
├── backend/                    NestJS 10
│   └── src/
│       ├── auth/               JWT auth (login, register)
│       ├── battles/            CRUD batailles + statistiques
│       └── users/              Entité utilisateur
├── scripts/
│   ├── extract-monsters.js     Extraction depuis le HTML source
│   ├── fetch-swarfarm-monsters.js  Complétion via API SWARFARM
│   └── fetch-swarfarm-images.js    Images CDN + IDs éveillés
├── docker-compose.yml          PostgreSQL 16
└── sw_siege_tracker.html       Fichier source original
```

---

## Variables d'environnement

Copie `backend/.env.example` → `backend/.env` et remplis les valeurs :

| Variable     | Description             | Défaut             |
|--------------|-------------------------|--------------------|
| `DB_HOST`    | Hôte PostgreSQL         | `localhost`        |
| `DB_PORT`    | Port PostgreSQL         | `5432`             |
| `DB_USER`    | Utilisateur             | `swsiege`          |
| `DB_PASS`    | Mot de passe            | `swsiege_pass`     |
| `DB_NAME`    | Nom de la base          | `sw_siege_tracker` |
| `JWT_SECRET` | Clé secrète JWT         | *(à changer)*      |
| `PORT`       | Port du serveur backend | `3000`             |

> ⚠️ Ne jamais commiter le fichier `.env`.

---

## Importer votre compte SW

1. Téléchargez [SW Exporter](https://github.com/Xzandro/sw-exporter) et exportez votre compte
2. Connectez-vous sur l'application
3. Accédez à l'onglet **📥 Import** et déposez votre fichier JSON
4. Les onglets Monstres, Runes et Artefacts se remplissent automatiquement

> Les données restent dans votre navigateur — elles ne sont pas envoyées au serveur.
