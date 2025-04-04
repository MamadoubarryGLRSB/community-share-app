const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.log(`Erreur de connexion MongoDB: ${err}`));

// Initialiser l'app
const app = express();

// Configuration de sécurité
app.use(helmet());

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuration du moteur de template (choisir l'un des deux)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // ou 'pug'

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes (à compléter)
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

module.exports = app;
