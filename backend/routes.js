const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

// Route 1

// Route 2

// Route 3

// Route 4

// Route 5

// Route 6

// Route 7
const reviewsPerHotel = async function (req, res) {
  try {
    const data = await connection.query(`
    SELECT a.hotel_name, COUNT(f.primary_key) AS review_count
    FROM address_df a
    JOIN final_df f ON a.address = f.address
    GROUP BY a.hotel_name
    ORDER BY review_count DESC;`);

    console.log(data.json);
    res.status(200).json({'message': 'success'});
  } catch (e) {
    res.status(404).json({'error': e});
  }
}

// Route 8
const topHotels = async function (req, res) {

}

// Route 9
const mostImproved = async function (req, res) {

}

// Route 10
const distribution = async function (req, res) {

}

module.exports = {
  reviewsPerHotel
}
