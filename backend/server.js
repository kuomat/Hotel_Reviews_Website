const express = require("express");
const app = express();
const routes = require("./routes");
const port = process.env.PORT || 8080;
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors())
// Add any other middleware here (e.g., cors, body-parser)

app.get('/bestCategHotel', routes.hotels_with_best_categ_score);
app.get('/geographicalArea', routes.geographical_area);
app.get('/hotelsScore', routes.hotels_max_num_reviews);
app.get('/avgScoresMonth/:year/:month', routes.average_scores_by_month_year);
app.get('/:hotel/avgScoresCategories', routes.average_scores_by_categories);
app.get('/:hotel/reviews', routes.reviews_per_hotel);
app.get('/tophotels/:year', routes.top_hotels);
app.get('/mostImproved', routes.most_improved);
app.get('/reviewDistribution', routes.distribution);
app.post('/search', routes.search);
app.get('/hotel/:hotelName', routes.hotel);
app.get('/years', routes.get_years);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;