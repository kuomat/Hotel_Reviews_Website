# Hotel_Reviews_Website
CIS 5500 project

To start the project you need to open 2 terminals:
-You need to cd into frontend and run npm start
-You need to cd into frontend and run npm start

The package.json for backend looks like the following:
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "mysql": "^2.18.1",
    "nodemon": "^3.1.0"
  },
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}


The package.json for frontend looks like the following:
{
  "name": "backend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "@mui/material": "^5.15.16",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.6.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.12.6",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "jest": "^27.5.1",
    "supertest": "^7.0.0"
  }
}


Project Overview:
Our project’s goal is to help people choose hotels based on the location they want to go to, ratings, and general reviews. The application compiles information from multiple sources and a multitude of hotels globally, giving more varied data for users to get a more comprehensive view of their options. On the home page, users are allowed to view the top scoring hotels in various metrics such as most improved, most reviewed, and top overall scores. We also provide a review distribution for users to get a sense of the amount of data and any skew in our data. The application also allows users to search/filter based on hotel name, location, and minimum rating. Lastly, we allow users to filter by month and year to see the top scoring hotels in any year and month. Through these pages, they can also look at a specific hotel in more detail, looking at the address and all its reviews.

