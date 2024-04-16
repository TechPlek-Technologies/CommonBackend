import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { app } from "./app.js";
import { config } from "./config/index.js";
import connectDB from "./db/index.js";

connectDB()
  .then((x) => {
    app.listen(config.PORT, () => {
      console.log(
        `Server is running on port http://localhost:${config.PORT} 🚀🚀`
      );
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
    process.exit(1);
  });
