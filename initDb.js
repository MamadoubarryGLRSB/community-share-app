const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/community-share';

async function connectDB() {
  try {
    // Connexion Mongoose pour les modèles standards
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion à MongoDB établie avec succès (Mongoose)');

    // Initialisation des collections Time Series avec MongoClient
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('community-share');

    // Vérifier si la collection alerts existe déjà
    const collections = await db.listCollections({ name: 'alerts' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('alerts', {
        timeseries: {
          timeField: 'createdAt',
          metaField: 'type',
          granularity: 'seconds'
        }
      });
      console.log('✅ Collection "alerts" Time Series créée');
    } else {
      console.log('ℹ️ La collection "alerts" existe déjà');
    }

    await client.close();
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB', error);
    process.exit(1);
  }
}

module.exports = connectDB;
