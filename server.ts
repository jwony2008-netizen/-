import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'site-state.json');
const PUBLIC_STATE_FILE = path.join(__dirname, 'public', 'site-state.json');
const SRC_SAVED_STATE_FILE = path.join(__dirname, 'src', 'data', 'savedState.json');
const PUBLIC_UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DIST_UPLOADS_DIR = path.join(__dirname, 'dist', 'uploads');

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }
}

function extractBase64Image(val: unknown, prefix: string): unknown {
  if (typeof val !== 'string' || !val.startsWith('data:image/')) return val;
  const match = val.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return val;
  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';
  const buf = Buffer.from(match[2], 'base64');
  const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 12);
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `${safePrefix}-${hash}.${ext}`;

  ensureDirs();
  fs.writeFileSync(path.join(PUBLIC_UPLOADS_DIR, filename), buf);

  // Also write to dist/uploads if running in production build mode
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    if (!fs.existsSync(DIST_UPLOADS_DIR)) {
      fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), buf);
  }

  return `/uploads/${filename}`;
}

function normalizeAndPersistState(payload: any) {
  ensureDirs();
  const normalized = { ...payload };

  if (normalized.config && typeof normalized.config === 'object') {
    normalized.config = {
      ...normalized.config,
      logoUrl: extractBase64Image(normalized.config.logoUrl, 'logo'),
    };
  }

  if (Array.isArray(normalized.portfolio)) {
    normalized.portfolio = normalized.portfolio.map((item: any, idx: number) => ({
      ...item,
      beforeImage: extractBase64Image(item?.beforeImage, `before-${item?.id || idx}`),
      afterImage: extractBase64Image(item?.afterImage, `after-${item?.id || idx}`),
    }));
  }

  normalized.updatedAt = normalized.updatedAt || Date.now();
  const serialized = JSON.stringify(normalized, null, 2);

  fs.writeFileSync(STATE_FILE, serialized, 'utf8');
  try {
    fs.writeFileSync(PUBLIC_STATE_FILE, serialized, 'utf8');
  } catch {
    // ignore if public dir unavailable
  }
  try {
    fs.writeFileSync(SRC_SAVED_STATE_FILE, serialized, 'utf8');
  } catch {
    // ignore if src/data unavailable
  }

  return normalized;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use('/uploads', express.static(PUBLIC_UPLOADS_DIR));

  app.get('/api/state', (_req, res) => {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const raw = fs.readFileSync(STATE_FILE, 'utf8');
        res.json(JSON.parse(raw));
      } else if (fs.existsSync(SRC_SAVED_STATE_FILE)) {
        const raw = fs.readFileSync(SRC_SAVED_STATE_FILE, 'utf8');
        res.json(JSON.parse(raw));
      } else {
        res.json(null);
      }
    } catch (error) {
      console.error('Failed to read server state:', error);
      res.status(500).json({ error: 'Failed to read state' });
    }
  });

  app.post('/api/state', (req, res) => {
    try {
      const normalized = normalizeAndPersistState(req.body);
      res.json({ ok: true, updatedAt: normalized.updatedAt, state: normalized });
    } catch (error) {
      console.error('Failed to write server state:', error);
      res.status(500).json({ error: 'Failed to save state' });
    }
  });

  app.delete('/api/state', (_req, res) => {
    try {
      if (fs.existsSync(STATE_FILE)) {
        fs.unlinkSync(STATE_FILE);
      }
      res.json({ ok: true });
    } catch (error) {
      console.error('Failed to delete server state:', error);
      res.status(500).json({ error: 'Failed to delete state' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
