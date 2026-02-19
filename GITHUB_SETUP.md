# 🚀 Guide pour Publier sur GitHub

## ⚠️ IMPORTANT - À FAIRE AVANT LE PUSH

### 1. Modifier les informations sensibles dans `mon-backend-node/server.js`

**Ligne 38-39** : Remplacez l'email et le mot de passe Gmail
```javascript
// AVANT (NE PAS COMMITER)
user: 'hajarakouk5@gmail.com',
pass: 'chxlkiripxhbcaaa'

// APRÈS (À COMMITER)
user: 'votre_email@gmail.com',  // Ou utilisez des variables d'environnement
pass: 'votre_mot_de_passe_app'
```

**Ligne 45-47** : Vérifiez les credentials MySQL
```javascript
host: 'localhost',
user: 'root',
password: '',  // Si vous avez un mot de passe, mettez-le ou utilisez des variables d'env
database: 'um6p-achat'
```

## 📋 Étapes pour Publier sur GitHub

### 1. Créer le repository sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez :
   - **Repository name** : `um6p-gestion-achat` (ou un autre nom)
   - **Description** : `Application web de gestion des demandes d'achat pour l'UM6P - Projet de stage`
   - **Visibility** : Public ou Private (selon votre choix)
   - **NE COCHEZ PAS** "Initialize with README" (vous avez déjà un README)
4. Cliquez sur **"Create repository"**

### 2. Initialiser Git et Pousser le Code

Ouvrez votre terminal dans le dossier du projet et exécutez :

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Faire le premier commit
git commit -m "Initial commit - Système de gestion des demandes d'achat UM6P

- Application web full-stack React/Node.js
- Gestion des demandes d'achat avec workflow multi-étapes
- Authentification et gestion des rôles
- Traitement automatique de fichiers Excel
- Dashboard de gestion et suivi
- Notifications par email

Projet développé dans le cadre d'un stage à l'UM6P (Juillet-Août 2025)"

# 4. Renommer la branche principale en 'main'
git branch -M main

# 5. Ajouter le remote GitHub (remplacez par votre URL)
git remote add origin https://github.com/VOTRE_USERNAME/um6p-gestion-achat.git

# 6. Pousser le code
git push -u origin main
```

### 3. Vérifier que tout est bien uploadé

1. Allez sur votre repository GitHub
2. Vérifiez que tous les fichiers sont présents
3. Vérifiez que le README.md s'affiche correctement
4. **IMPORTANT** : Vérifiez que `mon-backend-node/server.js` ne contient PAS vos vrais credentials

## 📁 Fichiers Créés pour GitHub

- ✅ `.gitignore` - Exclut les fichiers sensibles et node_modules
- ✅ `.gitattributes` - Gère les fins de ligne
- ✅ `LICENSE` - Licence MIT
- ✅ `SECURITY.md` - Avertissements de sécurité
- ✅ `CONTRIBUTING.md` - Guide de contribution
- ✅ `README.md` - Documentation complète
- ✅ `mon-backend-node/uploads/.gitkeep` - Garde le dossier uploads

## 🔒 Sécurité

**N'OUBLIEZ PAS** :
- ❌ Ne commitez JAMAIS vos vrais mots de passe
- ❌ Ne commitez JAMAIS le fichier `.env` s'il existe
- ✅ Utilisez des valeurs d'exemple dans le code
- ✅ Consultez `SECURITY.md` pour plus d'informations

## 📝 Description pour GitHub

**Titre du Repository** :
```
Système de Gestion des Demandes d'Achat - UM6P
```

**Description courte** :
```
Application web full-stack React/Node.js pour la gestion des demandes d'achat à l'Université Mohammed VI Polytechnique. Projet de stage développé avec authentification, workflow multi-étapes, traitement Excel et notifications.
```

**Topics/Tags suggérés** :
- `react`
- `nodejs`
- `express`
- `mysql`
- `gestion-achat`
- `um6p`
- `stage`
- `full-stack`
- `javascript`
- `web-application`

## ✅ Checklist Avant le Push

- [ ] Credentials email modifiés dans `server.js`
- [ ] Credentials MySQL vérifiés dans `server.js`
- [ ] Tous les fichiers de test supprimés
- [ ] README.md à jour
- [ ] `.gitignore` configuré correctement
- [ ] Aucun fichier sensible dans le commit
- [ ] Code nettoyé (pas de console.log de debug)

## 🎉 C'est Prêt !

Une fois le push terminé, votre projet sera visible sur GitHub et vous pourrez le partager dans votre CV ou portfolio.
