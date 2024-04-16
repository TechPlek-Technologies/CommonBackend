import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { config } from "../config/index.js";
import { MaxRequestBodySize } from "../constants.js";

const globalMiddleware = express();

// Custom Morgan logging format
morgan.token("custom-time", () => {
  const date = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
  const formattedDate = date.toISOString().replace("T", " ").slice(0, -1);
  return formattedDate;
});

const customLoggingFormat = `\n:custom-time - :method :url :status :response-time ms\n\n${"🔊".repeat(
  50
)}`;

// CORS middleware
globalMiddleware.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

globalMiddleware.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.CORS_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Body parsing middleware
globalMiddleware.use(express.json({ limit: MaxRequestBodySize }));
globalMiddleware.use(
  express.urlencoded({ extended: true, limit: MaxRequestBodySize })
);

// Serve static files
globalMiddleware.use(express.static("public"));

// Cookie parser middleware
globalMiddleware.use(cookieParser());

// Morgan logging middleware
globalMiddleware.use(morgan(customLoggingFormat));

export { globalMiddleware };
