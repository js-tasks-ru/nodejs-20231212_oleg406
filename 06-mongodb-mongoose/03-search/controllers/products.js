const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  ctx.body = {
    products: await Product
    .find(
      { $text: { $search: ctx.query.query } },
      { score: { $meta: 'textScore' } }
    )
    .sort(
      { score: { $meta: 'textScore' } }
    )
  };
};
