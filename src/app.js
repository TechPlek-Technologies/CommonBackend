import express from "express";

// global middleware import
import { globalMiddleware } from "./middlewares/global.middleware.js";

const app = express();

app.use(globalMiddleware);

// routes import
import healthCheckRouter from "./routes/healthCheck/healthCheck.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import usersRouter from "./routes/users/users.route.js";
import rolesRouter from "./routes/roles/roles.route.js";

// routes
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/role", rolesRouter);

// Home Route
app.get("/", (_, res) => {
  return res.send("<h1>CAB APPLICATION BACKEND</h1>");
});

// common error handling middleware
app.use(errorHandler);

export { app };
