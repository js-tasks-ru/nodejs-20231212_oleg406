const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = new Set();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    subscribers.add(resolve);

    ctx.req.on('close', () => {
      subscribers.delete();
      resolve();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    subscribers.forEach((resolve) => {
      resolve(message);
    });
    subscribers.clear();
    ctx.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
