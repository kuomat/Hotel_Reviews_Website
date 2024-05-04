const mysql = require('mysql');
const config = require('./config.json');

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
// 1 second
// GET /:hotelName
const hotel = async function (req, res) {
  const hotelName = req.params.hotelName;
  var sql = `SELECT * FROM final_cleaned f
  JOIN address_cleaned a ON f.address = a.address
  WHERE a.hotel_name = '${hotelName}'
  LIMIT 1;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        date: result.date,
        overall_score: result.overall_score,
        service_score: result.service_score,
        cleanliness_score: result.cleanliness_score,
        value_score: result.value_score,
        location_score: result.location_score,
        sleep_quality_score: result.sleep_quality_score,
        rooms_score: result.rooms_score,
      }));
      res.status(200).json(mappedData);
    }
  });
};

// Route 2
// 16.91 seconds
// GET /bestCategHotel
//// Create indexes like this:
// CREATE INDEX idx_address_cleaned_address ON address_cleaned(address);
// CREATE INDEX idx_final_cleaned_address ON final_cleaned(address);

const hotels_with_best_categ_score = async function (req, res) {
  // const sqlQuery = `
  //   (
  //     SELECT 'Service' AS category, a.hotel_name, AVG(f.service_score) AS avg_score
  //     FROM address_cleaned a JOIN final_cleaned f ON a.address = f.address
  //     GROUP BY a.hotel_name
  //     ORDER BY avg_score DESC
  //     LIMIT 1
  //   )
  //   UNION ALL
  //   (
  //     SELECT 'Cleanliness' AS category, a.hotel_name, AVG(f.cleanliness_score) AS avg_score
  //     FROM address_cleaned a JOIN final_cleaned f ON a.address = f.address
  //     GROUP BY a.hotel_name
  //     ORDER BY avg_score DESC
  //     LIMIT 1
  //   )
  //   UNION ALL
  //   (
  //     SELECT 'Value' AS category, a.hotel_name, AVG(f.value_score) AS avg_score
  //     FROM address_cleaned a JOIN final_cleaned f ON a.address = f.address
  //     GROUP BY a.hotel_name
  //     ORDER BY avg_score DESC
  //     LIMIT 1
  //   );`;

  const sqlQuery = `
    (
      WITH joined AS (
        SELECT a.hotel_name AS hotel_name, AVG(f.service_score) AS service_score, AVG(f.cleanliness_score) AS cleanliness_score, AVG(f.value_score) AS value_score
        FROM address_cleaned a JOIN final_cleaned f ON a.address = f.address
        GROUP BY a.hotel_name
      )
      (
        SELECT 'Service' AS category, joined.hotel_name AS hotel_name, joined.service_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC
        LIMIT 1
      ) UNION ALL (
        SELECT 'Cleanliness' AS category, joined.hotel_name AS hotel_name, joined.cleanliness_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC
        LIMIT 1
      ) UNION ALL (
        SELECT 'Value' AS category, joined.hotel_name AS hotel_name, joined.value_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC
        LIMIT 1
      )
    )`;

  connection.query(sqlQuery, (err, results) => {
    if (err || results.length === 0) {
      res.status(404).json({ error: err });
    } else {
      const mappedResults = results.map((result) => ({
        category: result.category,
        hotel_name: result.hotel_name,
        avg_score: result.avg_score,
      }));
      res.status(200).json(mappedResults);
    }
  });
};

// Route 3
// 1 second
//GET /geographicalArea
const geographical_area = async function (req, res) {
  const sqlQuery = `
  SELECT ROUND(a.lat,1) AS lat_rounded, ROUND(a.LNG,1) AS lng_rounded, AVG(f.overall_score) AS average_rating
  FROM address_cleaned a JOIN final_cleaned f ON a.address = f.address
  GROUP BY lat_rounded, lng_rounded;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err || results.length === 0) {
      res.status(404).json({ error: err });
    } else {
      const mappedResults = results.map((result) => ({
        lat_rounded: result.lat_rounded,
        lng_rounded: result.lng_rounded,
        average_rating: result.average_rating,
      }));
      res.status(200).json(mappedResults);
    }
  });
};

// Route 4
// 5 seconds
//GET /hotelsScore
const hotels_max_num_reviews = async function (req, res) {
  const sqlQuery = `
  SELECT
      hotel_name AS Hotel,
      COUNT(*) AS Number_of_Reviews
  FROM
      joinedViewNewData
  GROUP BY
      hotel_name
  ORDER BY
      Number_of_Reviews DESC
  LIMIT 10;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err || results.length === 0) {
      res.status(404).json({ error: err });
    } else {
      const mappedResults = results.map((result) => ({
        hotel_name: result.hotel_name,
        average_rating: result.average_rating,
      }));
      res.status(200).json(mappedResults);
    }
  });
};

// Route 5
// 9 seconds
// GET /avgScoresMonth
const average_scores_by_month_year = async function (req, res) {
  const sql = `SELECT
    a.hotel_name,
    EXTRACT(YEAR FROM STR_TO_DATE(f.date, '%m/%d/%Y')) AS review_year,
    EXTRACT(MONTH FROM STR_TO_DATE(f.date, '%m/%d/%Y')) AS review_month,
    AVG(f.overall_score) AS average_score
  FROM
    address_cleaned a
  JOIN
    final_cleaned f ON a.address = f.address
  GROUP BY
    a.hotel_name,
    review_year,
    review_month
  ORDER BY
    review_year,
    review_month;
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        review_year: result.review_year,
        review_month: result.review_month,
        average_score: result.average_score,
      }));
      res.status(200).json(mappedData);
    }
  });
};

// Route 6
// 7 seconds
// GET /avgScoresCategories
const average_scores_by_categories = async function (req, res) {
  const sql = `SELECT
    a.hotel_name,
    AVG(f.service_score) AS avg_service_score,
    AVG(f.cleanliness_score) AS avg_cleanliness_score,
    AVG(f.value_score) AS avg_value_score,
    AVG(f.location_score) AS avg_location_score,
    AVG(f.sleep_quality_score) AS avg_sleep_quality_score,
    AVG(f.rooms_score) AS avg_rooms_score
  FROM address_cleaned a
  JOIN final_cleaned f ON a.address = f.address
  GROUP BY a.hotel_name;
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        avg_service_score: result.avg_service_score,
        avg_cleanliness_score: result.avg_cleanliness_score,
        avg_value_score: result.avg_value_score,
        avg_location_score: result.avg_location_score,
        avg_sleep_quality_score: result.avg_sleep_quality_score,
        avg_rooms_score: result.avg_rooms_score,
      }));
      res.status(200).json(mappedData);
    }
  });
};

// Route 7
// 5.68 seconds
// GET /reviews
const reviews_per_hotel = async function (req, res) {
  const sql = `SELECT a.hotel_name, COUNT(f.primary_key) AS review_count
  FROM address_cleaned a
  JOIN final_cleaned f ON a.address = f.address
  GROUP BY a.hotel_name
  ORDER BY review_count DESC
  LIMIT 10;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        review_count: result.review_count,
      }));
      res.status(200).json(mappedData);
    }
  });
};

// Route 8
// 1 second
// GET /tophotels/:year
const top_hotels = async function (req, res) {
  const year = req.params.year;
  const sql = `SELECT
    a.hotel_name,
    COUNT(f.review) AS review_count,
    YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) AS review_year
    FROM address_cleaned a
    JOIN final_cleaned f ON a.address = f.address
    WHERE YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) = '${year}'
    GROUP BY a.hotel_name
    ORDER BY review_count DESC
    LIMIT 10;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        review_count: result.review_count,
        review_year: result.review_year,
      }));
      res.status(200).json(mappedData);
    }
  });
};

// Route 9
// 12.5 seconds
// GET /mostImproved
const most_improved = async function (req, res) {
  const sql = `SELECT year_current.hotel_name, (year_current.avg_score - year_previous.avg_score) AS improvement
  FROM (SELECT a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) AS year, AVG(f.overall_score) AS avg_score
        FROM address_cleaned a
        JOIN final_cleaned f ON a.address = f.address
        GROUP BY a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y'))) year_current
  JOIN (SELECT a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) AS year, AVG(f.overall_score) AS avg_score
        FROM address_cleaned a
        JOIN final_cleaned f ON a.address = f.address
        GROUP BY a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y'))) year_previous
  ON year_current.hotel_name = year_previous.hotel_name
  WHERE year_current.year = year_previous.year + 1
  ORDER BY improvement DESC
  LIMIT 10;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        improvement: result.improvement,
      }));
      res.status(200).json(mappedData);
    }
  });
};

// Route 10
// 1 second
// GET /reviewDistribution
const distribution = async function (req, res) {
  const sql = `SELECT f.overall_score, COUNT(*) AS number_of_reviews
  FROM final_cleaned f
  GROUP BY f.overall_score
  ORDER BY f.overall_score
  LIMIT 10;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        overall_score: result.overall_score,
        number_of_reviews: result.number_of_reviews,
      }));
      res.status(200).json(mappedData);
    }
  });
};


// GET /search
const search = async function (req, res) {
  let { name, location, minRating } = req.body;
  var sql = `SELECT a.hotel_name, a.address, f.overall_score
  FROM final_cleaned f JOIN address_cleaned a ON f.address = a.address WHERE`;

  if (!name && !location && !minRating) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  if (name) {
    sql = sql + ` a.hotel_name LIKE '%${name}%'`;
  }
  if (location) {
    if (name) {
      sql = sql + ` AND`;
    }
    sql = sql + ` a.address LIKE '%${location}%'`;
  }
  if (minRating) {
    if (name || location) {
      sql = sql + ` AND`;
    }
    sql = sql + ` f.overall_score >= ${minRating}`;
  }

  sql = sql + ` ORDER BY f.overall_score DESC;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        address: result.address,
        overall_score: result.overall_score,
      }));
      res.status(200).json(mappedData);
    }
  });
};

module.exports = {
  hotels_with_best_categ_score,
  geographical_area,
  hotels_max_num_reviews,
  average_scores_by_month_year,
  average_scores_by_categories,
  reviews_per_hotel,
  top_hotels,
  most_improved,
  distribution,
  search,
  hotel
};


