const express = require("express");
const app = express();
const routes = require("./routes");
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
// Add any other middleware here (e.g., cors, body-parser)

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get('/recentReviews/:hotelname', routes.recent_reviews);
app.get('/bestCategHotel', routes.hotels_with_best_categ_score);
app.get('/geographicalArea', routes.geographical_area);
app.get('/hotelsScore/:rating', routes.hotels_score);

app.get('/avgScoresMonth', routes.average_scores_by_month_year);
app.get('/avgScoresCategories', routes.average_scores_by_categories);
app.get('/reviews', routes.reviews_per_hotel);
app.get('/tophotels/:year', routes.top_hotels);
app.get('/mostImproved', routes.most_improved);
app.get('/reviewDistribution', routes.distribution);
app.get('/search', routes.search);
app.get('/:hotelName', routes.hotel);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;