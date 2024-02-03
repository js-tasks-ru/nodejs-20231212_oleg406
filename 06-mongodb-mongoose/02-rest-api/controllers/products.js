const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const product = await Product.find({subcategory});
  ctx.body = {
    products: product.map((item) => (
      mapProduct(item)
    ))
  };
};

module.exports.productList = async function productList(ctx, next) {
  const list = await Product.find({});
 
  ctx.body = {
    products: list.map((item) => (
      mapProduct(item)
    ))
  };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!mongoose.isValidObjectId(id)) {
    ctx.throw(400, 'Product id is not valid');
  }
  
  const product = await Product.findById(id);
  if (!product) {
    ctx.throw(404, 'Product not found');
  }

  ctx.body = {
    product: {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description,
    }
  };
};

