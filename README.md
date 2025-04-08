Community Share App
Une application communautaire permettant de partager des informations, des alertes ou de bonnes adresses, avec géolocalisation sur une carte interactive.
Technologies utilisées

Node.js / Express (architecture MVC)
MongoDB pour la persistance des données
OpenStreetMap + Leaflet pour l'affichage cartographique
Collections Time Series pour les alertes géolocalisées

1-Installation et démarrage

2-Cloner le repository
git clone https://github.com/votre-username/community-share-app.git
cd community-share-app

3-Installer les dépendances
npm install

4-Lancer MongoDB avec Docker
docker run -d -p 27017:27017 -v mongodb_data:/data/db --name community-db mongo
Si le conteneur existe déjà:
docker start community-db

5-Démarrer l'application
npm start

6-Tests
Pour exécuter les tests:

7-Accéder à l'application
Ouvrez votre navigateur et accédez à l'URL:
http://localhost:3000


Fonctionnalités

Visualisation d'une carte interactive
Ajout de lieux d'intérêt géolocalisés
Signalement d'alertes temporaires (dangers, travaux, etc.)
Fonctionnalités CRUD complètes (création, lecture, modification, suppression)
Interface responsive adaptée aux différents appareils

Structure du projet

/controllers : Logique métier de l'application
/models : Modèles de données Mongoose
/routes : Routes API Express
/views : Templates EJS pour le rendu côté serveur
/public : Fichiers statiques
