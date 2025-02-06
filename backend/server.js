const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Allow CORS for your Netlify domain
const corsOptions = {
    origin: "https://mpxcases.netlify.app",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
const DATA_URL = "https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv";

app.get("/data", async (req, res) => {
    try {
        const response = await axios.get(DATA_URL);
        res.setHeader("Access-Control-Allow-Origin", "https://mpxcases.netlify.app"); // Explicitly allow Netlify
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
