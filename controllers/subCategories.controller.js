import { read, write } from '../utils/model.js';

export default {
  GET: (req, res) => {
    const subCategories = read('subcategories');
    const allProducts = read('products');

    subCategories.map(sub => {
      const subProducts = [];
      allProducts.map(p => {
        if (p.sub_category_id == sub.sub_category_id) {
          delete p.sub_category_id
          subProducts.push(p)
        }
      })
      if (subProducts.length > 0) {
        sub.products = subProducts;
      }
    })

    res.json(200, subCategories);
  },

  POST: async (req, res) => {
    const { category_id, sub_category_name } = await req.body
    const data = read('subCategories');
    const category = read('categories');

    try {
      let validation = category.find(c => c.category_id == category_id)
      if (!validation) {
        throw new Error('category is not found, enter existing category_id...')
      }
      const newSubCategory = {
        sub_category_id: data.at(-1)?.sub_category_id + 1 || 1,
        category_id,
        sub_category_name
      }
      data.push(newSubCategory)
      write('subCategories', data)
      res.json(201, { status: 201, message: 'new category is successfully created!' })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  PUT: async (req, res) => {
    const { sub_category_id, category_id, sub_category_name } = await req.body;
    const data = read('subCategories');
    const category = read('categories');

    try {
      let subCategory = data.find(sub => sub.sub_category_id == sub_category_id)
      if (!subCategory) {
        throw new Error('sub-category is not found, enter existing sub_category_id...')
      }

      if (category_id != undefined) {
        let validation = category.find(c => c.category_id == category_id)
        if (!validation) {
          throw new Error('category is not found, enter existing category_id...')
        }
      }

      subCategory.sub_category_id = sub_category_id || subCategory.sub_category_id;
      subCategory.category_id = category_id || subCategory.category_id;
      subCategory.sub_category_name = sub_category_name || subCategory.sub_category_name;

      write('subCategories', data);
      res.json(201, { status: 201, message: 'sub-category is successfully updated!' })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  DELETE: async (req, res) => {
    const { sub_category_id } = await req.body;
    const data = read('subCategories');

    try {
      let subCategoryIndex = data.findIndex(d => d.sub_category_id == sub_category_id)

      if (subCategoryIndex == -1) {
        throw new Error('sub-category is not found, enter existing sub_category_id...!')
      }

      data.splice(subCategoryIndex, 1);
      write('subCategories', data)
      res.json(200, { status: 204, message: 'sub-category is successfully deleted!' })
    } catch (error) {
      res.json(500, { status: 500, message: error.message })
    }
  }
};