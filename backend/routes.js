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
const average_scores_by_month_year = async function (req, res){
  const sql = `SELECT
  a.hotel_name,
  EXTRACT(YEAR FROM STR_TO_DATE(f.date, '%m/%d/%Y')) AS review_year,
  EXTRACT(MONTH FROM STR_TO_DATE(f.date, '%m/%d/%Y')) AS review_month,
  AVG(f.overall_score) AS average_score
FROM
  address_df a
JOIN
  final_df f ON a.address = f.address
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
    res.status(404).json({'error': err});
  } else {
    const mappedData = results.map(result => ({
      hotel_name: result.hotel_name,
      review_year: result.review_year,
      review_month: result.review_month,
      average_score: result.average_score
    }));
    res.status(200).json(mappedData);
  }
});

}

// Route 6
const average_scores_by_categories = async function (req, res) {
  const sql = `SELECT
  a.hotel_name,
  AVG(f.service_score) AS avg_service_score,
  AVG(f.cleanliness_score) AS avg_cleanliness_score,
  AVG(f.value_score) AS avg_value_score,
  AVG(f.location_score) AS avg_location_score,
  AVG(f.sleep_quality_score) AS avg_sleep_quality_score,
  AVG(f.rooms_score) AS avg_rooms_score
FROM address_df a
JOIN final_df f ON a.address = f.address
GROUP BY a.hotel_name;
`;

connection.query(sql, (err, results) => {
  if (err) {
    res.status(404).json({'error': err});
  } else {
    const mappedData = results.map(result => ({
      hotel_name: result.hotel_name,
      avg_service_score: result.avg_service_score,
      avg_cleanliness_score: result.avg_cleanliness_score,
      avg_value_score: result.avg_value_score,
      avg_location_score: result.avg_location_score,
      avg_sleep_quality_score: result.avg_sleep_quality_score,
      avg_rooms_score: result.avg_rooms_score
    }));
    res.status(200).json(mappedData);
  }
});
}


// Route 7

// const getAllTables = async function (req, res) {
//   try {
//     const result = await connection.query('show tables;');
    
//     // Extract the rows from the result object
//     const rows = result.rows;

//     console.log(rows); // This will log all the table names
//     res.status(200).json({ 'data': rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 'message': 'error' });
//   }
// }


const reviewsPerHotel = async function (req, res) {
  const sql = `SELECT a.hotel_name, COUNT(f.primary_key) AS review_count
  FROM address_df a
  JOIN final_df f ON a.address = f.address
  GROUP BY a.hotel_name
  ORDER BY review_count DESC;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({'error': err});
    } else {
      const mappedData = results.map(result => ({
        hotel_name: result.hotel_name,
        review_count: result.review_count,
      }));
      res.status(200).json(mappedData);
    }
  });
}

// Route 8
const topHotels = async function (req, res) {
  const year = req.params.year;
  const sql = `SELECT
    a.hotel_name,
    COUNT(f.review) AS review_count,
    YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) AS review_year
    FROM address_df a
    JOIN final_df f ON a.address = f.address
    WHERE YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) = '${year}'
    GROUP BY a.hotel_name
    ORDER BY review_count DESC
    LIMIT 10;`;
    
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({'error': err});
    } else {
      const mappedData = results.map(result => ({
        hotel_name: result.hotel_name,
        review_count: result.review_count,
        review_year: result.review_year,
      }));
      res.status(200).json(mappedData);
    }
  });
}

// Route 9
const mostImproved = async function (req, res) {
  const sql = `SELECT year_current.hotel_name, (year_current.avg_score - year_previous.avg_score) AS improvement
  FROM (SELECT a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) AS year, AVG(f.overall_score) AS avg_score
        FROM address_df a
        JOIN final_df f ON a.address = f.address
        GROUP BY a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y'))) year_current
  JOIN (SELECT a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y')) AS year, AVG(f.overall_score) AS avg_score
        FROM address_df a
        JOIN final_df f ON a.address = f.address
        GROUP BY a.hotel_name, YEAR(STR_TO_DATE(f.date, '%m/%d/%Y'))) year_previous
  ON year_current.hotel_name = year_previous.hotel_name
  WHERE year_current.year = year_previous.year + 1
  ORDER BY improvement DESC
  LIMIT 10;;`;

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({'error': err});
    } else {
      const mappedData = results.map(result => ({
        hotel_name: result.hotel_name,
        improvement: result.improvement
      }));
      res.status(200).json(mappedData);
    }
  });
}

// Route 10
const distribution = async function (req, res) {
  const sql = `SELECT f.overall_score, COUNT(*) AS number_of_reviews
  FROM final_df f
  GROUP BY f.overall_score
  ORDER BY f.overall_score;`;
    
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(404).json({'error': err});
    } else {
      const mappedData = results.map(result => ({
        overall_score: result.overall_score,
        number_of_reviews: result.number_of_reviews,
      }));
      res.status(200).json(mappedData);
    }
  });
}

module.exports = {
  reviewsPerHotel,
  topHotels,
  mostImproved,
  distribution,
  average_scores_by_month_year,
  average_scores_by_categories
}
