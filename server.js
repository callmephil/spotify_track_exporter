const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { parse } = require("json2csv");
const fs = require("fs");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API to export tracks to CSV
app.post("/api/export", (req, res) => {
  const tracks = req.body.tracks || [];

  if (tracks.length === 0) {
    console.log("No tracks available to export.");
    return res.status(404).send({ message: "No tracks available to export." });
  }

  console.log(tracks.length);

  let csv;
  try {
    csv = parse(tracks);
  } catch (err) {
    console.error("Error parsing tracks to CSV:", err);
    return res.status(500).send({ message: "Error parsing tracks to CSV." });
  }

  const filePath = "tracks.csv";

  try {
    fs.writeFileSync(filePath, csv);
    console.log("CSV file written successfully.");
  } catch (err) {
    console.error("Error writing CSV file:", err);
    return res.status(500).send({ message: "Error writing CSV file." });
  }

  res.status(200).send({ message: "CSV file written successfully." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
