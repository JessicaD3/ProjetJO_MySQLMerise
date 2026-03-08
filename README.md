# SI JO Milano–Cortina 2026

Application web Next.js + MySQL pour la gestion des Jeux Olympiques Milano–Cortina 2026.

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- **Node.js** (version 20 recommandée)
- **npm**
- **MySQL Workbench** ou un serveur **MySQL 8**
- **Docker Desktop** si vous souhaitez lancer le projet avec Docker

---

# 1. Lancement avec Docker 

## Étape 1 — Extraire le projet
Décompresser le fichier `.zip` dans un dossier local.

---

## Étape 2 — Configurer les variables d'environnements 
Créer un fichier: .env.local

Avec le contenu suivant:
```bash
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=jo2026root
DB_NAME=jo_2026
DB_DW_NAME=jo_2026_dw
MYSQL_ROOT_PASSWORD=jo2026root
JWT_SECRET=change_me_super_secret_2026
APP_URL=http://localhost:3000
NODE_ENV=production
```

## Étape 3 — Installer les dépendances
Ouvrir un terminal à la racine du projet puis exécuter :

```bash
docker compose up --build
```

## Étape 4 — Accéder à  l'application 
L'application sera disponible ici: 
```bash
http://localhost:3000
```
Et MySQL sera disponoble ici:
```bash
Host : 127.0.0.1

Port : 3307

User : root

Password : valeur définie dans .env.docker
```


# 2. Lancement en local (sans Docker)

## Étape 1 — Extraire le projet
Décompresser le fichier `.zip` dans un dossier local.

---

## Étape 2 — Installer les dépendances
Ouvrir un terminal à la racine du projet puis exécuter :

```bash
npm install
```
## Étape 3 — Configurer les variables d'environnements 
Créer un fichier: .env.local

Avec le contenu suivant:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=VOTRE_MOT_DE_PASSE_MYSQL
DB_NAME=jo_2026
DB_DW_NAME=jo_2026_dw
JWT_SECRET=change_me_super_secret
APP_URL=http://localhost:3000
```

## Étape 4 — Importer les bases de données
Dans MySQl WorkBench, importez la base principale: 
```bash
jo_2026.sql
```

Puis importez la base analytique: 
```bash
jo_2026_dw.sql
```

## Étape 5 — Lancer l'application
Ouvrir un terminal à la racine du projet puis exécuter :

```bash
npm run dev
```

L’application sera accessible à l’adresse :
```bash
http://localhost:3000
```


