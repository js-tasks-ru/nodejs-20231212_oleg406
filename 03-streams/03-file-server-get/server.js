const url = require('node:url');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET': {
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested paths are not allowed');
        return;
      }

      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', (err) => {
        switch (err.code) {
          case 'ENOENT':
            res.statusCode = 404;
            res.end('File not exist');
            break;
          default:
            res.statusCode = 500;
            res.end('Internal error');
        }
      });

      stream.on('close', () => {
        if (!req.complete) {
          fs.unlink(filepath, () => {});
        }
      });

      stream.on('finish', () => {
        res.end('Finish');
      });

      break;
    }
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
