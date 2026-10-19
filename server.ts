import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'site-state.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.get('/api/state', (_req, res) => {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const raw = fs.readFileSync(STATE_FILE, 'utf8');
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
      ensureDataDir();
      const payload = req.body;
      fs.writeFileSync(STATE_FILE, JSON.stringify(payload, null, 2), 'utf8');
      res.json({ ok: true, updatedAt: payload?.updatedAt || Date.now() });
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
