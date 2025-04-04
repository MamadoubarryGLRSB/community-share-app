// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/community-share-app-db", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("✅ Connexion à MongoDB réussie");
    } catch (err) {
        console.error("❌ Erreur de connexion à MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
