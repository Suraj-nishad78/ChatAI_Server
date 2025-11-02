import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

//Imports Routes
import { connectDb } from "./src/database/mongodb.js";
import userRoutes from "./src/features/users/users.routes.js";
import * as google from "./src/features/users/users.google.js";

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/users", userRoutes);

//google Routes

app.get("/auth/google", google.authGoogle);
app.get("/auth/google/callback", google.authGoogleCallback);

//google Routes

//ChatGPT Api Call
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching data from ChatGPT:", error);
    throw error;
  }
}

app.get("/", (req, res) => {
  res.send("Hello world :)");
});

app.post("/fetch-data", async (req, res) => {
  const { query } = req.body;
  try {
    const data = await generateContent(query);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server is running on port ${process.env.PORT}`);
});
