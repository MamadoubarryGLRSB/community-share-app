const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Initialiser l'app
const app = express();
connectDB();

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

// Routes
const homeRoutes = require('./routes.home')
app.use('/', homeRoutes);

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

module.exports = app;
