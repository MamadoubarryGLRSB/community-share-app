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
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//       directives: {
//           defaultSrc: ["'self'"],
//           scriptSrc: ["'self'", "https://unpkg.com", "https://cdnjs.cloudflare.com"], // Ajouter le CDN de Leaflet
//           styleSrc: ["'self'", "https://unpkg.com", "https://cdnjs.cloudflare.com"], // Ajouter les styles si nécessaire
//           imgSrc: ["'self'", "data:", "https://www.openstreetmap.org"], // Autoriser les images de OpenStreetMap
//           connectSrc: ["'self'"], // Pour les requêtes HTTP externes si nécessaire
//           fontSrc: ["'self'"],
//           objectSrc: ["'none'"],  // Bloque les objets/Flash
//           upgradeInsecureRequests: [], // Pour permettre de passer aux connexions HTTPS
//       },
//   })
// );

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
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'leaflet', 'dist')));

// Routes
const indexRoutes = require('./routes/home');
app.use('/', indexRoutes);
const mapRoutes = require('./routes/map');
app.use('/map', mapRoutes);

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

module.exports = app;
