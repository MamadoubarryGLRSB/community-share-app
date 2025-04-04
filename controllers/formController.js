const reviewModel = require("../models/formModel");

exports.showForm = (req, res) => {
  console.log("Affichage du formulaire");
  res.render("formView");
};

exports.submitReview = (req, res) => {
  const { place, comment, rating } = req.body;

  // Enregistrement (ici, dans un tableau temporaire)
  reviewModel.addReview({ place, comment, rating });

  res.send(
    `Merci pour votre avis sur "${place}" avec une note de ${rating} étoile(s) !`
  );
};
