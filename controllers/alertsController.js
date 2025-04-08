const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/community-share';
let alertsCollection;

// Connexion unique à la collection Time Series "alerts"
MongoClient.connect(uri)
  .then((client) => {
    const db = client.db('community-share');
    alertsCollection = db.collection('alerts');
    console.log('✅ Connected to alerts Time Series collection');
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

// GET /api/alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await alertsCollection.find({}).toArray();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/alerts
exports.createAlert = async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = new Date();

    if (!data.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      data.expiresAt = expiresAt;
    }

    const result = await alertsCollection.insertOne(data);
    res.status(201).json({ ...data, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/alerts/:id
exports.deleteAlert = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await alertsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/alerts/nearby
exports.findNearbyAlerts = async (req, res) => {
  try {
    const { lng, lat, distance = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ error: 'Coordinates are required' });
    }

    const alerts = await alertsCollection
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng), parseFloat(lat)],
              parseFloat(distance) / 6378100 // Conversion en radians
            ]
          }
        }
      })
      .toArray();

    res.json(alerts);
  } catch (error) {
    console.error('Error finding nearby alerts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
