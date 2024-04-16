import ProductionConfig from "./production.env.js";
import DevelopmentConfig from "./development.env.js";

let _configuration;

if (process.env.NODE_ENV?.toLowerCase() === "production") {
  _configuration = ProductionConfig;
} else if (process.env.NODE_ENV?.toLowerCase() === "development") {
  _configuration = DevelopmentConfig;
} else {
  throw new Error(
    "⭕⭕⭕ Please provide NODE_ENV variable in .env file ⭕⭕⭕"
  );
}

export const config = Object.freeze(_configuration);
