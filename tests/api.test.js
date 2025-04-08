const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const alertsRouter = require('../routes/alerts');
const placesRouter = require('../routes/place');
const Place = require('../models/place');

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);
app.use('/api/places', placesRouter);

const uri = 'mongodb://localhost:27017/community-share';
let alertsCollection;
let mongoClient;

// Initialiser la connexion MongoDB pour les tests
beforeAll(async () => {
  // Connexion avec MongoClient pour les alertes (Time Series)
  mongoClient = await MongoClient.connect(uri);
  const db = mongoClient.db('community-share');
  alertsCollection = db.collection('alerts');
  console.log('✅ Connecté à la collection Time Series alerts pour les tests');

  // Connexion Mongoose pour les modèles (Place)
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ Connecté à MongoDB avec Mongoose');
});

afterAll(async () => {
  try {
    // Nettoyer la base de données
    if (alertsCollection) {
      await alertsCollection.deleteMany({});
      console.log('✅ Collection alerts nettoyée');
    }

    await Place.deleteMany({});
    console.log('✅ Collection places nettoyée');

    // Fermer les connexions
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('✅ Connexion Mongoose fermée');
    }

    if (mongoClient) {
      await mongoClient.close();
      console.log('✅ Connexion MongoClient fermée');
    }
  } catch (error) {
    console.error('❌ Erreur pendant le nettoyage:', error);
  }
});

describe('Tests API Alerts', () => {
  test('GET /api/alerts - Doit retourner un tableau', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/alerts - Doit créer une nouvelle alerte', async () => {
    const nouvelleAlerte = {
      title: 'Alerte de test',
      description: 'Ceci est une alerte de test',
      location: {
        type: 'Point',
        coordinates: [2.3522, 48.8566] // Paris
      },
      type: 'danger'
    };

    const res = await request(app).post('/api/alerts').send(nouvelleAlerte);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(nouvelleAlerte.title);
    expect(res.body.type).toBe(nouvelleAlerte.type);

    // Stocker l'ID pour les tests suivants
    global.alerteId = res.body._id;
  });

  test('GET /api/alerts/nearby - Doit trouver les alertes à proximité', async () => {
    const res = await request(app).get('/api/alerts/nearby').query({ lng: 2.3522, lat: 48.8566, distance: 10000 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Devrait trouver au moins l'alerte que nous venons de créer
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('DELETE /api/alerts/:id - Doit supprimer une alerte', async () => {
    const res = await request(app).delete(`/api/alerts/${global.alerteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Alert deleted successfully');

    // Vérifier que l'alerte a bien été supprimée
    const alerteSupprimee = await alertsCollection.findOne({ _id: new ObjectId(global.alerteId) });
    expect(alerteSupprimee).toBeNull();
  });
});

describe('Tests API Places', () => {
  test('GET /api/places - Doit retourner un tableau', async () => {
    const res = await request(app).get('/api/places');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/places - Doit créer un nouveau lieu', async () => {
    const nouveauLieu = {
      name: 'Café de test',
      description: 'Un café pour les tests',
      address: '10 rue de Test, Paris',
      location: {
        type: 'Point',
        coordinates: [2.3522, 48.8566] // Paris
      },
      category: 'restaurant'
    };

    const res = await request(app).post('/api/places').send(nouveauLieu);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(nouveauLieu.name);
    expect(res.body.category).toBe(nouveauLieu.category);

    // Stocker l'ID pour les tests suivants
    global.lieuId = res.body._id;
  });

  test('GET /api/places/nearby - Doit trouver les lieux à proximité', async () => {
    const res = await request(app).get('/api/places/nearby').query({ lng: 2.3522, lat: 48.8566, distance: 10000 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Devrait trouver au moins le lieu que nous venons de créer
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('PUT /api/places/:id - Doit mettre à jour un lieu', async () => {
    const donneesMAJ = {
      name: 'Café de test mis à jour',
      description: 'Description mise à jour'
    };

    const res = await request(app).put(`/api/places/${global.lieuId}`).send(donneesMAJ);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(donneesMAJ.name);
    expect(res.body.description).toBe(donneesMAJ.description);
  });

  test('DELETE /api/places/:id - Doit supprimer un lieu', async () => {
    const res = await request(app).delete(`/api/places/${global.lieuId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Place deleted successfully');

    // Vérifier que le lieu a bien été supprimé
    const lieuSupprime = await Place.findById(global.lieuId);
    expect(lieuSupprime).toBeNull();
  });
});
