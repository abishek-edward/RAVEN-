import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { checkConnection } from './db/client.js';
import { runMigrationsAndSeed } from './db/seed.js';

import schemesRouter from './routes/schemes.js';
import civicRouter from './routes/civic.js';
import confirmationsRouter from './routes/confirmations.js';
import profilesRouter from './routes/profiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/api/health')) {
      console.log(`[HTTP] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkConnection();
  const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== '');

  res.json({
    status: 'ok',
    service: 'RAVEN Backend API',
    database: {
      provider: 'Supabase PostgreSQL',
      connected: dbStatus.connected,
      timestamp: dbStatus.timestamp || null,
      error: dbStatus.error || null
    },
    ai: {
      provider: 'Anthropic Claude',
      configured: aiConfigured
    },
    version: '1.0.0'
  });
});

// Seed endpoint (safe, idempotent)
app.post('/api/seed', async (req, res) => {
  try {
    await runMigrationsAndSeed();
    res.json({ success: true, message: 'Database verified and seeded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mount Routes
app.use('/api/schemes', schemesRouter);
app.use('/api/civic', civicRouter);
app.use('/api/confirmations', confirmationsRouter);
app.use('/api/profiles', profilesRouter);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 [RAVEN Server] Running on http://localhost:${PORT}`);
  console.log(`📡 [Database] Connecting to Supabase at ${process.env.SUPABASE_URL || 'Configured URL'}...`);
  
  const conn = await checkConnection();
  if (conn.connected) {
    console.log(`✅ [Database] Successfully connected to Supabase PostgreSQL.`);
  } else {
    console.warn(`⚠️ [Database] Connection warning: ${conn.error}`);
  }
});
