import "dotenv/config";

import express from "express";
const app = express();

app.use(express.static("public"));

import helmet from "helmet";
app.use(helmet());

app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import cors from "cors";
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4000", "http://localhost:8080"],
  })
);

import rateLimit from "express-rate-limit";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(baseLimiter);
app.use("/login", authLimiter);

import authRouter from "./routers/authRouter.js"; // login/signup router
app.use(authRouter);

import gameRouter from "./routers/gameRouter.js";
app.use(gameRouter)

import { authenticateUser, checkIfAdmin } from "./public/auth.js"; //auth functions


app.listen(8080, () => {
  console.log("Server is running on: ", 8080);
});
