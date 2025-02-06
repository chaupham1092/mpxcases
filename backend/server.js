const express = require("express");
const cors = require("cors");
const axios = require("axios");
const csv = require("csv-parser");
const { Readable } = require("stream");

const app = express();
app.use(cors());

const DATA_URL = "https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv";

async function fetchData() {
  const response = await axios.get(DATA_URL);
  return response.data;
}

app.get("/data", async (req, res) => {
  try {
    const csvData = await fetchData();
    const results = [];

    const stream = Readable.from(csvData);
    stream
      .pipe(csv())
      .on("data", (row) => {
        if (row["Country"] === "World") {
          results.push({
            date: row["Date"],
            confirmed: parseInt(row["Confirmed Cases"] || 0),
            deaths: parseInt(row["Death Cases"] || 0),
          });
        }
      })
      .on("end", () => {
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.json(results);
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
