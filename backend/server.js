const express = require("express");
const axios = require("axios");
const cors = require("cors");
const csv = require("csv-parser");
const stream = require("stream");

const app = express();
app.use(cors({ origin: "https://mpxcases.netlify.app" }));

const PORT = process.env.PORT || 3000;
const DATA_URL = "https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv";

async function fetchGlobalData() {
    try {
        const response = await axios.get(DATA_URL, { responseType: "stream" });
        return new Promise((resolve, reject) => {
            const results = [];
            response.data
                .pipe(csv())
                .on("data", (row) => {
                    if (row["Entity"] === "World") { // Filter only World data
                        results.push({
                            date: row["Date"],
                            confirmed: parseInt(row["Cumulative Confirmed Cases"] || "0", 10),
                            deaths: parseInt(row["Cumulative Deaths"] || "0", 10)
                        });
                    }
                })
                .on("end", () => resolve(results))
                .on("error", reject);
        });
    } catch (error) {
        throw new Error("Failed to fetch data");
    }
}

app.get("/data", async (req, res) => {
    try {
        const data = await fetchGlobalData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
