# 🌍 Community Share App

------------------------------------------------------------------------------------------------------------

# 🙋🏽 Qu'est-ce que Community Share App ? 
Community Share App est une application communautaire permettant de partager des informations, des alertes ou de bonnes adresses, avec géolocalisation sur une carte interactive.

------------------------------------------------------------------------------------------------------------

__💻 Technologies utilisées__

Node.js / Express (architecture MVC)
MongoDB pour la persistance des données
OpenStreetMap + Leaflet : Affichage cartographique
Collections Time Series : Alertes géolocalisées

__💾 Installation et démarrage__

1-Cloner le repository
+ Copiez le lien Https depuis le repo git du projet.
+ Ouvrez un terminal depuis votre bureau.
+ Tapez la commande : git clone https://github.com/votre-username/community-share-app.git
+ Puis tapez la commande : cd community-share-app

2-Installer les dépendances
+ Tapez la commande : bash npm install

3-Lancer MongoDB avec Docker
+ Depuis le terminal de Docker, tapez : docker run -d -p 27017:27017 -v mongodb_data:/data/db --name community-db mongo
Si le conteneur existe déjà alors tapez : docker start community-db

4-Démarrer l'application
+ Pour lancer l'application, tapez sur le terminal du projet la commande suivante : npm start

5-Accéder à l'application
+ Ouvrez votre navigateur et accédez à l'URL: http://localhost:3000

------------------------------------------------------------------------------------------------------------

# ✅ Fonctionnalités

+ Visualisation d'une carte interactive.
+ Ajout de lieux d'intérêt géolocalisés.
+ Signalement d'alertes temporaires (dangers, travaux, etc.).
+ Fonctionnalités CRUD complètes (création, lecture, modification, suppression).
+ Ajout d'une CI/CD pour automatiser le build
+ Ajout des Tests
+ Interface responsive adaptée aux différents appareils.

------------------------------------------------------------------------------------------------------------

# 🏛️ Structure du projet

+ /controllers : Logique métier de l'application
+ /models : Modèles de données Mongoose
+ /routes : Routes API Express
+ /views : Templates EJS pour le rendu côté serveur
+ /public : Fichiers statiques (CSS, JavaScript, images)
