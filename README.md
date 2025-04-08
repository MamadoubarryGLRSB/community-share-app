🌍 Community Share App
Community Share App est une application communautaire permettant aux utilisateurs de partager des informations utiles, des alertes temporaires ou encore des bonnes adresses. Le tout est affiché sur une carte interactive grâce à la géolocalisation.

🚀 Technologies utilisées
Node.js / Express — architecture MVC

MongoDB — persistance des données, avec collections Time Series pour les alertes géolocalisées

OpenStreetMap + Leaflet — affichage cartographique interactif

⚙️ Installation et démarrage
1. Cloner le repository
bash
Copier
Modifier
git clone https://github.com/votre-username/community-share-app.git
cd community-share-app
2. Installer les dépendances
bash
Copier
Modifier
npm install
3. Lancer MongoDB avec Docker
bash
Copier
Modifier
docker run -d -p 27017:27017 -v mongodb_data:/data/db --name community-db mongo
💡 Si le conteneur existe déjà :

bash
Copier
Modifier
docker start community-db
4. Démarrer l’application
bash
Copier
Modifier
npm start
5. Exécuter les tests 
bash
Copier
Modifier
npm test
🌐 Accéder à l'application
Une fois le serveur lancé, ouvrez votre navigateur à l'adresse suivante :

➡️ http://localhost:3000

✨ Fonctionnalités principales
📍 Carte interactive avec géolocalisation

➕ Ajout de lieux d'intérêt par les utilisateurs

🚧 Signalement d’alertes temporaires (dangers, travaux, etc.)

🔁 Fonctionnalités CRUD complètes

📱 Interface responsive adaptée aux mobiles et tablettes

🗂️ Structure du projet
bash
Copier
Modifier
/controllers   → Logique métier (contrôleurs Express)
/models        → Modèles Mongoose (schémas MongoDB)
/routes        → Définition des routes de l’API
/views         → Templates EJS pour le rendu côté serveur
/public        → Fichiers statiques
