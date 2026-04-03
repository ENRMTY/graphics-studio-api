// external
import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// internal
import sequelize from "./config/sequelize";
import teamsRouter from "./routes/team.route";
import competitionsRouter from "./routes/competition.route";
import graphicsRouter from "./routes/graphics.route";
import authRouter from "./routes/auth.route";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? "4000", 10);

// middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/competitions", competitionsRouter);
app.use("/api/graphics", graphicsRouter);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// boot
async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    app.listen(PORT, () => {
      console.log(`Graphics Studio API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();

export default app;
