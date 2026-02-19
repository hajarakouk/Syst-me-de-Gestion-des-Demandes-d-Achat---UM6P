const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Configuration multer pour les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    fieldSize: 100 * 1024 * 1024 // 100MB
  }
});

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configuration pour Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hajarakouk5@gmail.com',
    pass: 'chxlkiripxhbcaaa'
  }
});

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'um6p-achat'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à MySQL');

    // Créer la table users
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `;
    
    // Créer la table demandes
    const createDemandesTableQuery = `
      CREATE TABLE IF NOT EXISTS demandes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        objet VARCHAR(255) NOT NULL,
        famille VARCHAR(100) NOT NULL,
        demandeur VARCHAR(255) NOT NULL,
        entite VARCHAR(255),
        urgence VARCHAR(50) DEFAULT 'Normal',
        type_achat VARCHAR(100),
        prix DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'reçue',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fichiers TEXT,
        lignes_excel TEXT,
        description TEXT,
        justification TEXT,
        note_admin TEXT
      )
    `;
    
    db.query(createUsersTableQuery, (err) => {
      if (!err) {
        const insertUsersQuery = `
          INSERT IGNORE INTO users (id, name, email, role, password) VALUES 
          (1, 'Admin', 'admin@um6p.ma', 'admin', 'admin123'),
          (2, 'User', 'user@um6p.ma', 'user', 'user123')
        `;
        db.query(insertUsersQuery);
      }
    });
    
    db.query(createDemandesTableQuery, (err) => {
      if (!err) {
        // Ajouter les colonnes manquantes si elles n'existent pas
        const alterQueries = [
          'ALTER TABLE demandes ADD COLUMN IF NOT EXISTS entite VARCHAR(255)',
          'ALTER TABLE demandes ADD COLUMN IF NOT EXISTS urgence VARCHAR(50) DEFAULT "Normal"',
          'ALTER TABLE demandes ADD COLUMN IF NOT EXISTS type_achat VARCHAR(100)',
          'ALTER TABLE demandes ADD COLUMN IF NOT EXISTS lignes_excel TEXT',
          'ALTER TABLE demandes ADD COLUMN IF NOT EXISTS description TEXT',
          'ALTER TABLE demandes ADD COLUMN IF NOT EXISTS justification TEXT',
          'ALTER TABLE demandes CHANGE COLUMN IF EXISTS date_creation date TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        ];
        
        alterQueries.forEach((query) => {
          db.query(query, (err) => {
            if (err && !err.message.includes('Duplicate column')) {
              console.error('Erreur lors de la vérification des colonnes:', err.message);
            }
          });
        });
      }
    });
  }
});

// GET: Liste des utilisateurs
app.get('/api/users', (req, res) => {
  db.query('SELECT id, name, email, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

// POST: Ajouter un utilisateur
app.post('/api/users', (req, res) => {
  const { name, email, password, role } = req.body;
  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('Erreur insertion utilisateur:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'ajout' });
    }
    res.json({ id: result.insertId, name, email, role });
  });
});

// PUT: Modifier un utilisateur
app.put('/api/users/:id', (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params;

  const fields = [];
  const values = [];

  if (name) { fields.push('name = ?'); values.push(name); }
  if (email) { fields.push('email = ?'); values.push(email); }
  if (role) { fields.push('role = ?'); values.push(role); }
  if (password) { fields.push('password = ?'); values.push(password); }

  if (fields.length === 0) return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(query, values, (err) => {
    if (err) {
      console.error('Erreur update:', err);
      return res.status(500).json({ error: 'Erreur lors de la modification' });
    }
    res.json({ message: 'Utilisateur mis à jour' });
  });
});

// DELETE: Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Erreur suppression:', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.json({ message: 'Utilisateur supprimé' });
  });
});

// Route de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    
    if (results.length > 0) {
      const user = results[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  });
});

// Route pour créer une demande d'achat
app.post('/api/demandes', upload.any(), (req, res) => {
  const {
    objet = '',
    famille = '',
    demandeur = '',
    entite = '',
    urgence = '',
    type_achat = '',
    prix = '',
    description = '',
    justification = '',
    lignes_excel = '[]'
  } = req.body;

  // Traiter les fichiers
  let fichiers = [];
  if (req.files && req.files.length > 0) {
    fichiers = req.files.map(file => ({
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      type: file.mimetype.includes('excel') ? 'excel' : 'file'
    }));
  }

  
  const query = `
    INSERT INTO demandes (objet, famille, demandeur, entite, urgence, type_achat, prix, description, justification, fichiers, lignes_excel, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  
  db.query(query, [
    objet, famille, demandeur, entite, urgence, type_achat, prix, description, justification,
    JSON.stringify(fichiers), lignes_excel
  ], (err, result) => {
    if (err) {
      console.error('Erreur création demande:', err);
      return res.status(500).json({ error: 'Erreur lors de la création de la demande' });
    }
    
    res.json({ 
      success: true, 
      message: 'Demande créée avec succès',
      id: result.insertId
    });
  });
});

// Route pour vérifier/corriger la structure de la table
app.get('/api/check-table', (req, res) => {
  const checkQuery = `
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'demandes' AND TABLE_SCHEMA = DATABASE()
  `;
  
  db.query(checkQuery, (err, results) => {
    if (err) {
      console.error('Erreur vérification table:', err);
      return res.status(500).json({ error: 'Erreur lors de la vérification de la table' });
    }
    
    const hasDateColumn = results.some(col => col.COLUMN_NAME === 'date');
    const hasDateModificationColumn = results.some(col => col.COLUMN_NAME === 'date_modification');
    
    let promises = [];
    
    if (!hasDateColumn) {
      promises.push(new Promise((resolve, reject) => {
        const alterQuery = 'ALTER TABLE demandes ADD COLUMN date TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
        db.query(alterQuery, (alterErr) => {
          if (alterErr) {
            console.error('Erreur ajout colonne date:', alterErr);
            reject(alterErr);
          } else {
            resolve();
          }
        });
      }));
    }
    
    if (!hasDateModificationColumn) {
      promises.push(new Promise((resolve, reject) => {
        const alterQuery = 'ALTER TABLE demandes ADD COLUMN date_modification TIMESTAMP NULL';
        db.query(alterQuery, (alterErr) => {
          if (alterErr) {
            console.error('Erreur ajout colonne date_modification:', alterErr);
            reject(alterErr);
          } else {
            resolve();
          }
        });
      }));
    }
    
    Promise.all(promises)
      .then(() => {
        res.json({ 
          message: 'Table structure OK',
          structure: results,
          hasDateColumn: hasDateColumn,
          hasDateModificationColumn: hasDateModificationColumn
        });
      })
      .catch(error => {
        res.status(500).json({ error: 'Erreur lors de la modification de la table' });
      });
  });
});

// Route pour récupérer toutes les demandes
app.get('/api/demandes', (req, res) => {
  const { famille, status } = req.query;

  let sql = 'SELECT d.*, d.date AS date_creation, u.name as demandeur_name FROM demandes d LEFT JOIN users u ON d.demandeur = u.email';
  const params = [];
  const conditions = [];

  if (famille && famille !== 'Toutes') {
    conditions.push('d.famille = ?');
    params.push(famille);
  }

  if (status) {
    if (status === 'non_confirmée') {
      conditions.push('(d.status = ? OR d.status = ? OR d.status = ? OR d.status = ? OR d.status = ?)');
      params.push('non_confirmée', 'non conforme', 'non_confirmee', 'Non conforme', 'Non confirmée');
    } else {
      conditions.push('d.status = ?');
      params.push(status);
    }
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY d.date DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
    }
    
    const demandesAvecDetails = results.map(demande => {
      try {
        demande.fichiers = JSON.parse(demande.fichiers || '[]');
        demande.lignes_excel = JSON.parse(demande.lignes_excel || '[]');
      } catch (e) {
        demande.fichiers = [];
        demande.lignes_excel = [];
      }
      return demande;
    });
    
    res.json(demandesAvecDetails);
  });
});

// Route pour récupérer une demande spécifique
app.get('/api/demandes/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT d.*, u.name as demandeur_name 
    FROM demandes d 
    LEFT JOIN users u ON d.demandeur = u.email 
    WHERE d.id = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur récupération demande:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération de la demande' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }
    
    const demande = results[0];
    
    try {
      demande.fichiers = demande.fichiers ? JSON.parse(demande.fichiers) : [];
      demande.lignes_excel = demande.lignes_excel ? JSON.parse(demande.lignes_excel) : [];
    } catch (e) {
      demande.fichiers = [];
      demande.lignes_excel = [];
    }
    
    res.json(demande);
  });
});

// Route pour mettre à jour une demande
app.put('/api/demandes/:id', upload.array('fichiers', 10), (req, res) => {
  const { id } = req.params;
  const {
    objet = '',
    famille = '',
    demandeur = '',
    entite = '',
    urgence = '',
    type_achat = '',
    prix = '',
    description = '',
    justification = '',
    lignes_excel = '[]'
  } = req.body;

  db.query('SELECT fichiers, status FROM demandes WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erreur récupération fichiers existants:', err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
    
    let fichiers = [];
    let currentStatus = results[0]?.status || 'reçue';
    
    try {
      fichiers = results[0]?.fichiers ? JSON.parse(results[0].fichiers) : [];
    } catch (e) {
      fichiers = [];
    }
    
    if (req.files && req.files.length > 0) {
      const nouveauxFichiers = req.files.map(file => ({
        name: file.originalname,
        filename: file.filename,
        size: file.size
      }));
      fichiers = [...fichiers, ...nouveauxFichiers];
    }
    
    const query = `
      UPDATE demandes 
      SET objet = ?, famille = ?, demandeur = ?, entite = ?, urgence = ?, 
          type_achat = ?, prix = ?, description = ?, justification = ?, 
          fichiers = ?, lignes_excel = ?, status = ?
      WHERE id = ?
    `;
    
    const params = [
      objet, famille, demandeur, entite, urgence, type_achat, prix, 
      description, justification, JSON.stringify(fichiers), lignes_excel, currentStatus, id
    ];
    
    db.query(query, params, (err) => {
      if (err) {
        console.error('Erreur mise à jour demande:', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la demande' });
      }
      
      db.query('ALTER TABLE demandes ADD COLUMN IF NOT EXISTS date_modification TIMESTAMP NULL', (alterErr) => {
        if (!alterErr) {
          db.query('UPDATE demandes SET date_modification = NOW() WHERE id = ?', [id]);
        }
        
        res.json({ 
          success: true, 
          message: 'Demande mise à jour avec succès',
          id: parseInt(id),
          status: currentStatus
        });
      });
    });
  });
});

// DELETE: Supprimer une demande
app.delete('/api/demandes/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM demandes WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Erreur suppression demande:', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }
    
    res.json({ message: 'Demande supprimée avec succès' });
  });
});

// Route pour changer le statut d'une demande
app.put('/api/demandes/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, note_admin } = req.body;

  db.query('UPDATE demandes SET status = ?, note_admin = ? WHERE id = ?', [status, note_admin, id], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }

    db.query('SELECT demandeur, objet FROM demandes WHERE id = ?', [id], async (err2, results) => {
      if (err) {
        console.error('Erreur récupération demandeur:', err);
        return res.status(500).json({ error: 'Erreur interne' });
      }
      
      if (results.length > 0 && status === 'non_confirmée') {
        // Toujours utiliser l'email du demandeur stocké dans la base de données
        const demandeurEmail = results[0].demandeur;
        const objet = results[0].objet;

        const lien = `http://localhost:3000/modifier-demande/${id}`;

        const mailOptions = {
          from: 'hajarakouk5@gmail.com',
          to: demandeurEmail,
          subject: `Votre demande d'achat "${objet}" nécessite une modification`,
          html: `
            <p>Bonjour,</p>
            <p>Votre demande <b>${objet}</b> a été marquée comme <b>Non Conforme</b> par le gestionnaire.</p>
            <p><b>Note :</b> ${note_admin}</p>
            <p>Vous pouvez corriger votre demande en cliquant sur ce lien : <a href="${lien}">Modifier ma demande</a></p>
            <p>Cordialement,<br>L'équipe Achats</p>
          `
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email envoyé avec succès via Gmail:', info.response);
        } catch (error) {
          console.error('Erreur envoi email Gmail:', error);
        }
      }
      res.json({ success: true });
    });
  });
});

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend opérationnel' });
});

// Route pour servir les fichiers uploadés
app.use('/uploads', express.static('uploads'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur en cours sur http://localhost:${PORT}`);
});

