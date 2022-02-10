import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initDB } from './models';
import { DEV, PORT, SERVER } from './configLoader';

async function bootstap() {
  try {
    await initDB();
    console.log('Connected to database');
  } catch (err) {
    console.error('Connection to database failed', err);
  }

  const app = next({ dev: DEV, port: PORT });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/a') {
        app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        app.render(req, res, '/b', query);
      } else {
        handle(req, res, parsedUrl);
      }
    }).listen(PORT);

    console.log(`> Ready on ${SERVER}:${PORT}`);
  });
}

bootstap();
