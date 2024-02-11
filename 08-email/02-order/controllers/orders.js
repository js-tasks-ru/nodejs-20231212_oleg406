const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');
const mapOrder = require('../mappers/order');

async function checkSession(ctx) {
  const token = ctx.get('Authorization').split(' ')[1];
  const session = await Session.findOne({ token });
  if (!session) {
    ctx.throw(401, 'Пользователь не найден');
  }

  return session;
}

module.exports.checkout = async function checkout(ctx, next) {
  const session = await checkSession(ctx);
  const userId = session.user.toString();
  const order = new Order({ ...ctx.request.body, user: userId });
  await order.save();

  ctx.body = { order: order.id.toString() };

  const user = await session.populate('user');
  const usr = user.user;
  const product = await order.populate('product');
  const prdct = product.product;

  await sendMail({
    to: usr.email,
    template: 'order-confirmation',
    subject: 'Подтверждение заказа',
    locals: {
      id: usr.id.toString(),
      product: prdct,
    },
  });
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const session = await checkSession(ctx);
  const userId = session.user.toString();
  const orders = [...(await Order.find({ user: userId }).populate('product'))];
  orders.forEach(mapOrder);
  ctx.body = { orders };
};
