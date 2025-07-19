// __tests__/helpers/testServer.ts
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

let app: any;
let server: any;
let handle: any;

export const startTestServer = async () => {
  if (!app) {
    app = next({ dev: false, quiet: true });
    handle = app.getRequestHandler();
    await app.prepare();
  }

  if (!server) {
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });
  }

  return server;
};

export const stopTestServer = async () => {
  if (server) {
    server.close();
    server = null;
  }
  if (app) {
    await app.close();
    app = null;
  }
};
