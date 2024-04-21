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
const recentReviews = async function (req, res) {
  const hotelName = req.params.hotelname;
  if (!hotelName) {
    return res.status(400).json({error: 'Hotel name not provided.'});
  }

  connection.query(`
    SELECT a.hotel_name, f.date, f.review, f.overall_score
    FROM address_df a JOIN final_df f ON a.address = f.address
    INNER JOIN (
      SELECT address, MAX(date) AS max_date
      FROM final_df
      WHERE a.hotel_name = '${hotelName}'
      GROUP BY address
    ) AS latest ON f.address = latest.address AND f.date = latest.max_date
    WHERE a.hotel_name = '${hotelName}'
    ORDER BY a.hotel_name, f.date DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      res.status(404).json({error: err});
    } else {
      res.status(200).json(data.json);
    }
  });

}

// Route 2
const hotelsWithBestCategScore = async function (req, res) {
  connection.query(`
    (SELECT 'Service' AS category, a.hotel_name, AVG(f.service_score) AS avg_score
    FROM address_df a JOIN final_df f ON a.address = f.address
    GROUP BY a.hotel_name
    ORDER BY avg_score DESC
    LIMIT 1)
    UNION ALL
    (SELECT 'Cleanliness' AS category, a.hotel_name, AVG(f.cleanliness_score) AS avg_score
    FROM address_df a JOIN final_df f ON a.address = f.address
    GROUP BY a.hotel_name
    ORDER BY avg_score DESC
    LIMIT 1)
    UNION ALL
    (SELECT 'Value' AS category, a.hotel_name, AVG(f.value_score) AS avg_score
    FROM address_df a JOIN final_df f ON a.address = f.address
    GROUP BY a.hotel_name
    ORDER BY avg_score DESC
    LIMIT 1);
  `, (err, data) => {
    if (err || data.length === 0) {
      res.status(404).json({error: err});
    } else {
      res.status(200).json(data.json);
    }
  });
}

// Route 3
const geoArea = async function (req, res) {
  try {
    const data = await connection.query(`
      SELECT ROUND(a.lat,1) AS lat_rounded, ROUND(a.LNG,1) AS lng_rounded, AVG(f.overall_score) AS average_rating
      FROM address_df a JOIN final_df f ON a.address = f.address
      GROUP BY lat_rounded, lng_rounded;
    `);

    console.log(data.json);
    res.status(200).json({message: 'success'});
  } catch (e) {
    res.status(404).json({'error': e});
  }
}

// Route 4
const hotelsScore = async function (req, res) {
  const rating = req.params.rating;
  if (!rating) {
    return res.status(400).json({error: 'Rating not provided.'});
  }

  try {
    const data = await connection.query(`
      SELECT a.hotel_name, AVG(f.overall_score) AS average_rating
      FROM address_df a JOIN final_df f ON a.address = f.address
      GROUP BY a.hotel_name
      HAVING AVG(f.overall_score) > ${rating}    
    `);

    console.log(data.json);
    res.status(200).json({message: 'success'});
  } catch (e) {
    res.status(404).json({'error': e});
  }
}

// Route 5

// Route 6

// Route 7
const reviewsPerHotel = async function (req, res) {
  


  connection.query(`
    SELECT a.hotel_name, COUNT(f.primary_key) AS review_count
    FROM address_df a
    JOIN final_df f ON a.address = f.address
    GROUP BY a.hotel_name
    ORDER BY review_count DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      res.status(404).json({error: err});
    } else {
      res.status(200).json({data.json});
    }
  });
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
  recentReviews,
  hotelsWithBestCategScore,
  geoArea,
  hotelsScore,
  reviewsPerHotel
  
}
