const url = require('node:url');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const UPLOAD_LIMIT = 1048576;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST': {
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested paths are not allowed');
        return;
      }

      if (req.headers['content-length'] > UPLOAD_LIMIT) {
        res.statusCode = 413;
        res.end('File is too big');
        return;
      }

      const stream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: UPLOAD_LIMIT});

      stream.on('error', (err) => {
        switch (err.code) {
          case 'EEXIST':
            res.statusCode = 409;
            res.end('File already exist');
            break;
          default:
            res.statusCode = 500;
            res.end('Internal error');
        }
      });

      res.on('close', () => {
        if (!req.complete) {
          fs.unlink(filepath, () => {});
        }
      });

      stream.on('finish', () => {
        res.statusCode = 201;
        res.end('Finish');
      });

      limitStream.on('error', (err) => {
        switch (err.code) {
          case 'LIMIT_EXCEEDED':
            // res.setHeader('connection', 'close');
            res.statusCode = 413;
            res.end('File is too big');
            break;
          default:
            res.statusCode = 500;
            res.end('Internal error');
        }
      });

      req.pipe(limitStream).pipe(stream);
      break;
    }
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
