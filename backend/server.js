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

app.get('/hi', routes.reviewsPerHotel);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;