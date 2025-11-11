import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

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

//Test Routes
app.get("/", (req, res) => {
  res.send("Hello world :)");
});

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server is running on port ${process.env.PORT}`);
});
