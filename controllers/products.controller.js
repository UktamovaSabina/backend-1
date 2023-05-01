import { read, write } from '../utils/model.js';

export default {
  GET: (req, res) => {

    let products = read('products');
    const { model, subCategoryId } = req.query;

    const filteredData = products.filter(p => {
      if (model != undefined && subCategoryId != undefined) {
        return p.model == model && p.sub_category_id == subCategoryId
      } else if (model != undefined && subCategoryId == undefined) {
        return p.model == model
      } else {
        return p.sub_category_id == subCategoryId
      }
    });

    if (Object.keys(req.query).length) {
      res.json(200, filteredData);
    } else {
      res.json(200, products);
    }
  },

  POST: async (req, res) => {
    const { sub_category_id, model, product_name, color, price } = await req.body;
    const products = read('products');
    const subCategories = read('subCategories');

    try {
      let validation = subCategories.find(c => c.sub_category_id == sub_category_id)
      if (!validation) {
        throw new Error('sub-category is not found, enter existing sub_category_id...')
      }

      const newProduct = {
        product_id: products.at(-1)?.product_id + 1 || 1,
        sub_category_id,
        model,
        product_name,
        color,
        price
      }

      products.push(newProduct)
      res.json(201, { status: 201, message: 'new product is successfully created!' })
      write('products', products)
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  PUT: async (req, res) => {
    const { product_id, sub_category_id, model, product_name, color, price } = await req.body;
    const products = read('products');
    const subCategories = read('subCategories');

    try {
      const updatedProduct = products.find(p => p.product_id == product_id)
      if (!updatedProduct) {
        throw new Error('Product is not found, enter existing product_id...')
      }

      if (sub_category_id != undefined) {
        let validation = subCategories.find(sub => sub.sub_category_id == sub_category_id);
        if (!validation) {
          throw new Error('Sub-category is not found, enter existing sub_category_id...')
        }
      }

      updatedProduct.sub_category_id = sub_category_id || updatedProduct.sub_category_id
      updatedProduct.model = model || updatedProduct.model
      updatedProduct.product_name = product_name || updatedProduct.product_name
      updatedProduct.color = color || updatedProduct.color
      updatedProduct.price = price || updatedProduct.price

      write('products', products)
      res.json(200, { status: 200, message: 'product is successfully updated!' })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  DELETE: async (req, res) => {
    const { product_id } = await req.body;
    const products = read('products');

    try {
      let productIndex = products.findIndex(p => p.product_id == product_id);
      if (productIndex == -1) {
        throw new Error('Product is not found, enter existing product_id...')
      }
      products.splice(productIndex, 1);
      write('products', products);
      res.json(200, { status: 204, message: 'product is successfully deleted!' })
    } catch (error) {
      res.json(500, { status: 500, message: error.message })
    }
  }
};