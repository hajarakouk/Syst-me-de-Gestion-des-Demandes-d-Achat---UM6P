# ⚠️ Avertissement de Sécurité

## Informations Sensibles

Ce projet contient des informations sensibles dans le code source qui doivent être modifiées avant toute publication publique :

### Fichier : `mon-backend-node/server.js`

1. **Configuration Email (lignes 35-41)**
   ```javascript
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'hajarakouk5@gmail.com',  // ⚠️ À modifier
       pass: 'chxlkiripxhbcaaa'        // ⚠️ À modifier
     }
   });
   ```

2. **Configuration Base de Données (lignes 44-48)**
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',  // ⚠️ À modifier si vous avez un mot de passe
     database: 'um6p-achat'
   });
   ```

## Recommandations

1. **Avant de publier sur GitHub** :
   - Remplacez les credentials email par des valeurs factices ou utilisez des variables d'environnement
   - Vérifiez que votre mot de passe Gmail n'est pas exposé
   - Utilisez un mot de passe d'application Gmail plutôt que votre mot de passe principal

2. **Pour la production** :
   - Utilisez des variables d'environnement (fichier `.env`)
   - Ne commitez jamais le fichier `.env`
   - Utilisez un gestionnaire de secrets (AWS Secrets Manager, Azure Key Vault, etc.)

3. **Sécurité des mots de passe utilisateurs** :
   - Les mots de passe sont actuellement stockés en clair dans la base de données
   - **À améliorer** : Implémenter le hashage avec bcrypt avant la mise en production

## Contact

Pour toute question de sécurité, contactez : [votre-email@example.com]
