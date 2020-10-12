// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const app = express();

// Start up an instance of app

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
// get initial project data
app.get("/get-server-data", (req, res) => {
  res.send(projectData);
});

// post request to receive the project data, the weather data
// and the user response
app.post("/add-user-data", (req, res) => {
  try {
    const data = req.body;
    projectData = data;
    if (!data) {
      res.status(404);
    }
    res.send("data added successfully");
  } catch (e) {
    res.status(500).send("Something broke!");
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`app is running on port no ${port}`);
});
