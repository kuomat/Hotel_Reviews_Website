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
  var sql = `SELECT * FROM final_cleaned2 f
  JOIN address_cleaned2 a ON f.address = a.address
  WHERE a.hotel_name = '${hotelName}';`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        address: result.address,
        lat: result.lat,
        lng: result.lng,
        review: result.review,
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
// GET /bestCategHotel
const hotels_with_best_categ_score = async function (req, res) {
  //// Original optimization
//   const sqlQuery = `
//   (
//     SELECT 'Service' AS category, a.hotel_name, AVG(f.service_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Cleanliness' AS category, a.hotel_name, AVG(f.cleanliness_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL AND a.hotel_name IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Value' AS category, a.hotel_name, AVG(f.value_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Location' AS category, a.hotel_name, AVG(f.location_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Sleep Quality' AS category, a.hotel_name, AVG(f.sleep_quality_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Room' AS category, a.hotel_name, AVG(f.rooms_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Reviewer Score' AS category, a.hotel_name, AVG(f.Reviewer_Score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
//   )
//   UNION ALL
//   (
//     SELECT 'Overall' AS category, a.hotel_name, AVG(f.overall_score) AS avg_score
//     FROM final_cleaned2 f
//         LEFT JOIN address_cleaned2 a ON f.address = a.address
//     WHERE f.review IS NOT NULL
//     GROUP BY a.hotel_name
//     HAVING COUNT(*) > 15
//     ORDER BY avg_score DESC, a.hotel_name
//     LIMIT 5
    // );`;

  const sqlQuery = `
    WITH joined AS (
        SELECT hotel_name AS hotel_name,
              AVG(service_score) AS service_score,
              AVG(cleanliness_score) AS cleanliness_score,
              AVG(value_score) AS value_score,
              AVG(location_score) AS location_score,
              AVG(sleep_quality_score) AS sleep_quality_score,
              AVG(rooms_score) AS room_score,
              AVG(overall_score) AS overall_score
        FROM joinedViewNewData2
        GROUP BY hotel_name
        HAVING COUNT(*) > 15
    )
    (
        SELECT 'Service' AS category, hotel_name, service_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    )
    UNION
    (
        SELECT 'Cleanliness' AS category, hotel_name, cleanliness_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    )
    UNION
    (
        SELECT 'Value' AS category, hotel_name, value_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    )
    UNION
    (
        SELECT 'Location' AS category, hotel_name, location_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    )
    UNION
    (
        SELECT 'Sleep Quality' AS category, hotel_name, sleep_quality_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    )
    UNION
    (
        SELECT 'Room' AS category, hotel_name, room_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    )
    UNION
    (
        SELECT 'Overall' AS category, hotel_name, overall_score AS avg_score
        FROM joined
        ORDER BY avg_score DESC, hotel_name
        LIMIT 5
    );`;

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
  FROM address_cleaned2 a JOIN final_cleaned2 f ON a.address = f.address
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
    address_cleaned2 a
  JOIN
    final_cleaned2 f ON a.address = f.address
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
// GET /:hotel/avgScoresCategories
const average_scores_by_categories = async function (req, res) {
  const hotel = req.params.hotel;
  const sql = `SELECT
    a.hotel_name,
    AVG(f.overall_score) AS avg_overall_score,
    AVG(f.service_score) AS avg_service_score,
    AVG(f.cleanliness_score) AS avg_cleanliness_score,
    AVG(f.value_score) AS avg_value_score,
    AVG(f.location_score) AS avg_location_score,
    AVG(f.sleep_quality_score) AS avg_sleep_quality_score,
    AVG(f.rooms_score) AS avg_rooms_score
  FROM address_cleaned2 a
  JOIN final_cleaned2 f ON a.address = f.address
  WHERE a.hotel_name = '${hotel}';
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      const mappedData = results.map((result) => ({
        hotel_name: result.hotel_name,
        avg_overall_score: result.avg_overall_score,
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
  FROM address_cleaned2 a
  JOIN final_cleaned2 f ON a.address = f.address
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
    FROM address_cleaned2 a
    JOIN final_cleaned2 f ON a.address = f.address
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
  const sql = `SELECT
  year_current.hotel_name,
  (year_current.avg_overall_score - year_previous.avg_overall_score) AS overall_improvement,
  (year_current.avg_service_score - year_previous.avg_service_score) AS service_improvement,
  (year_current.avg_cleanliness_score - year_previous.avg_cleanliness_score) AS cleanliness_improvement,
  (year_current.avg_value_score - year_previous.avg_value_score) AS value_improvement
FROM
  (SELECT
      hotel_name,
      YEAR(date) AS year,
      AVG(overall_score) AS avg_overall_score,
      AVG(service_score) AS avg_service_score,
      AVG(cleanliness_score) AS avg_cleanliness_score,
      AVG(value_score) AS avg_value_score
   FROM joinedViewNewData1
   GROUP BY hotel_name, YEAR(date)
  ) year_current
JOIN
  (SELECT
      hotel_name,
      YEAR(date) AS year,
      AVG(overall_score) AS avg_overall_score,
      AVG(service_score) AS avg_service_score,
      AVG(cleanliness_score) AS avg_cleanliness_score,
      AVG(value_score) AS avg_value_score
   FROM joinedViewNewData1
   GROUP BY hotel_name, YEAR(date)
  ) year_previous
ON year_current.hotel_name = year_previous.hotel_name AND year_current.year = year_previous.year + 1
ORDER BY overall_improvement DESC
LIMIT 10;
`;

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
  FROM final_cleaned2 f
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
  FROM final_2 f JOIN address_cleaned2 a ON f.address = a.address WHERE`;

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


