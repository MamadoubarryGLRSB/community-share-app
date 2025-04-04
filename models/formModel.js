const reviews = [];

exports.addReview = (review) => {
  reviews.push(review);
  console.log("Avis enregistrés :", reviews);
};

exports.getAllReviews = () => {
  return reviews;
};
