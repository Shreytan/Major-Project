const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HF_API_KEY = process.env.HF_API_KEY; // Load API key from .env
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1"; // Use a valid model

app.post("/converse", async (req, res) => {
    try {
        const userMessage = req.body.message;
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
            { inputs: userMessage },
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        res.json({ response: response.data[0].generated_text });
    } catch (error) {
        console.error("Error fetching response:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Conversational AI assistant listening on port 3000!");
});
