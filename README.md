# SW 775 — Summoners War Companion

Application web multi-fonctions pour **Summoners War**, construite avec Angular 17 et NestJS. Chaque fonctionnalité est accessible depuis un menu de navigation commun.

## Fonctionnalités

### ⚔️ Siege Tracker *(disponible)*
Outil de suivi des attaques en siège de guilde.

- **Nouvelle attaque** : sélection des équipes attaquante et défensive (3 monstres chacune) via un picker avec recherche, filtre par élément et par rareté
- **Historique** : liste chronologique de tous les combats enregistrés avec suppression
- **Statistiques** : taux de victoire global, nombre de victoires/défaites, top 10 des monstres les plus utilisés avec leur win rate individuel

### 💎 Tri automatique de Runes *(bientôt)*
Analyse et tri de tes runes par set, stats et efficacité.

### 🔮 Artefacts *(bientôt)*
Gestion et optimisation de tes artefacts par type et stats.

---

## Stack technique

| Couche      | Technologie                        |
|-------------|------------------------------------|
| Frontend    | Angular 17, TypeScript, SCSS       |
| Backend     | NestJS 10, TypeScript              |
| Base de données | PostgreSQL 16, TypeORM         |
| Auth        | JWT (Passport.js), bcrypt          |
| Infra       | Docker, docker-compose             |

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

### 3. Extraire les données monstres *(une seule fois)*

```bash
node scripts/extract-monsters.js sw_siege_tracker.html
# → génère frontend/src/assets/data/monsters.json (971 monstres)
```

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
├── frontend/               Angular 17 (standalone components)
│   └── src/app/
│       ├── layout/         Navbar principale (MainLayoutComponent)
│       ├── pages/          Pages : siege, runes, artifacts, login, register
│       ├── components/     battle-form, monster-picker, history, statistics
│       ├── core/           services, guards, interceptors, pipes
│       └── models/         interfaces TypeScript
├── backend/                NestJS 10
│   └── src/
│       ├── auth/           JWT auth (login, register)
│       ├── battles/        CRUD batailles + statistiques
│       └── users/          Entité utilisateur
├── scripts/
│   └── extract-monsters.js Migration des données monstres
├── docker-compose.yml      PostgreSQL + backend
└── sw_siege_tracker.html   Fichier original (source des données monstres)
```

---

## Variables d'environnement

Copie `backend/.env.example` → `backend/.env` et remplis les valeurs :

| Variable     | Description                  | Défaut              |
|--------------|------------------------------|---------------------|
| `DB_HOST`    | Hôte PostgreSQL              | `localhost`         |
| `DB_PORT`    | Port PostgreSQL              | `5432`              |
| `DB_USER`    | Utilisateur                  | `swsiege`           |
| `DB_PASS`    | Mot de passe                 | `swsiege_pass`      |
| `DB_NAME`    | Nom de la base               | `sw_siege_tracker`  |
| `JWT_SECRET` | Clé secrète JWT              | *(à changer)*       |
| `PORT`       | Port du serveur backend      | `3000`              |

> ⚠️ Ne jamais commiter le fichier `.env`.
