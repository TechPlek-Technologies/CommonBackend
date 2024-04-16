import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

const config = {
  PORT: Number(process.env.PORT) || 8000,
  MONGODB_URI: process.env.MONGODB_DEV_URI || "mongodb://0.0.0.0:27017",
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
};

export default config;
