import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import sequelize from './config/sequelize';
import teamsRouter       from './routes/teams';
import competitionsRouter from './routes/competitions';
import graphicsRouter    from './routes/graphics';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app  = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/teams',        teamsRouter);
app.use('/api/competitions', competitionsRouter);
app.use('/api/graphics',     graphicsRouter);

// ─── 404 + error handler (must be last) ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Boot ─────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connected');

    // We use migrations, not sync — this is intentional
    // Run: npm run db:migrate before starting for the first time

    app.listen(PORT, () => {
      console.log(`🚀  LFC API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to start:', err);
    process.exit(1);
  }
}

start();

export default app;
