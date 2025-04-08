const express = require('express');
const path = require('path');
const connectDB = require('./initDb');

// Initialisation de l'app
const app = express();

// Connexion à la base de données
connectDB();

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// app.js - Mettre à jour les chemins d'importation
app.use('/api/places', require('./routes/place')); // Changé de places à place
app.use('/api/alerts', require('./routes/alerts'));

// Route principale
app.get('/', (req, res) => {
  res.render('index');
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;
