# Port Russell – Gestion des Catways, Réservations et Utilisateurs

Application web permettant la gestion complète des catways, des réservations et des utilisateurs du port de plaisance **Port Russell**.

Ce projet inclut :
- une API REST sécurisée (Node.js / Express / MongoDB)
- une interface web complète (HTML / CSS / JS)
- un système d’authentification par token
- un tableau de bord dynamique
- des pages CRUD dédiées
- une documentation API intégrée

## 🚀 Fonctionnalités principales

### 🔐 Authentification
- Connexion via email + mot de passe
- Token JWT stocké côté client
- Protection de toutes les routes sensibles

### 📊 Dashboard
Le tableau de bord affiche :
- Le nom et l’email de l’utilisateur connecté  
- La **date du jour**  
- Les **réservations en cours aujourd’hui**  
- Accès direct aux sections Catways, Réservations et Profil  

### 🛠 Gestion des Catways (CRUD)
- Liste des catways
- Ajout
- Modification
- Suppression
- Champs : `catwayNumber`, `catwayType`, `catwayState`

### 🛥 Gestion des Réservations (CRUD)
- Liste des réservations
- Ajout
- Modification
- Suppression
- Champs : `boatName`, `clientName`, `startDate`, `endDate`, `catwayNumber`

### 👤 Gestion des Utilisateurs (CRUD)
- Liste des utilisateurs
- Ajout
- Modification
- Suppression
- Champs : `name`, `email`, `password` (hashé)

## 📁 Structure du projet
/public /index.html
        /login.html 
        /dashboard.html
        /catways.html
        /reservations.html
        /users.html 
        /docs.html 
        /dashboard.js 
        /users.js 
        /dashboard.css 
        /login.css 
        /style.css
        /docs.css
/server.js 
/routes/ 
/models/ 
/middleware/
/services   /catways.js
            /reservations.js
            /users.js
/data
/db
/app.js
/server.js

## 🔧 Technologies utilisées

### Backend
- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT (authentification)  
- Bcrypt (hash des mots de passe)

### Frontend
- HTML5  
- CSS3  
- JavaScript Vanilla  
- Fetch API  

## 📘 Documentation API

La documentation complète est disponible dans :  
👉 `/documentation.html`

Elle décrit toutes les routes :
- `/catways`
- `/reservations`
- `/users`
- `/users/me`
- `/login`
- `/register`

## 🧪 Identifiants de test
Email: test@test.com
Mot de passe: 123456

## ▶️ Installation et lancement

### 1. Installer les dépendances
```bash
npm install

### 2. Lancer le serveur
npm start

### 3. Accéder à l'application
http://localhost:3000


---

# 🟪 **PARTIE 8 — Liens du projet**

```markdown
## 🌐 Liens du projet

- **Lien GitHub :** à compléter  
- **Lien application hébergée :** à compléter  

## 👤 Auteur

Projet réalisé par **Juan**, dans le cadre du module de développement web.