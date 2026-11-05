import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import subscribeHandler from './api/subscribe.js';
import productsHandler from './api/products.js';
import ordersHandler from './api/orders.js';
import reservationsHandler from './api/reservations.js';
import registerHandler from './api/register.js';
import loginHandler from './api/login.js';
import indexHandler from './api/index.js';

function createApiMiddleware() {
  return (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api')) {
      return next();
    }

    const parsedUrl = new URL(req.url, 'http://localhost');
    const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/api';
    req.query = Object.fromEntries(parsedUrl.searchParams.entries());

    // Match dynamic /api/products/:id or /api/orders/:id
    const prodMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (prodMatch) {
      req.query.id = prodMatch[1];
    }
    const orderMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (orderMatch) {
      req.query.id = orderMatch[1];
    }

    // Add Express/Vercel-compatible res.status() and res.json() helpers
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(data));
      return res;
    };

    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });
    req.on('end', () => {
      if (rawBody) {
        try {
          req.body = JSON.parse(rawBody);
        } catch {
          req.body = {};
        }
      } else {
        req.body = {};
      }

      if (pathname === '/api/subscribe') return subscribeHandler(req, res);
      if (pathname === '/api/products' || prodMatch) return productsHandler(req, res);
      if (pathname === '/api/orders' || orderMatch) return ordersHandler(req, res);
      if (pathname === '/api/reservations') return reservationsHandler(req, res);
      if (pathname === '/api/register' || pathname === '/api/signup') return registerHandler(req, res);
      if (pathname === '/api/login') return loginHandler(req, res);
      return indexHandler(req, res);
    });
  };
}

function beanSceneApiPlugin() {
  const middleware = createApiMiddleware();
  return {
    name: 'bean-scene-api-middleware',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), beanSceneApiPlugin()],
  server: {
    port: 3000,
  },
});
