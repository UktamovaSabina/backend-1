import { read, write } from '../utils/model.js';

export default {
  GET: (req, res) => {
    const categories = read('categories')
    const subcategories = read('subcategories')

    categories.map(category => {
      const result = []
      subcategories.map(subs => {
        if (subs.category_id == category.category_id) {
          delete subs.category_id
          result.push(subs)
        }
      })

      if (result.length > 0) {
        category.sub_categories = result
      }
    })
    res.json(200, categories);
  },

  POST: async (req, res) => {
    const { category_name } = await req.body
    const categories = read('categories');

    try {
      if (category_name.length <= 2) {
        throw new Error('invalid category name...')
      }
      const newCategory = {
        category_id: categories.at(-1)?.category_id + 1 || 1,
        category_name
      }

      categories.push(newCategory)
      write('categories', categories)
      res.json(201, { status: 201, message: 'new category is successfully created!' })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  PUT: async (req, res) => {
    const { category_id, category_name } = await req.body;
    const categories = read('categories');
    const category = categories.find((c) => c.category_id == category_id);

    try {
      if (!category) {
        throw new Error('category is not found, enter existing category_id...')
      }
      if (category_name.length <= 2) {
        throw new Error('invalid category name...')
      }

      category.category_name = category_name || category.category_name

      write('categories', categories)
      res.json(201, { status: 201, message: 'category is successfully updated!' })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  DELETE: async (req, res) => {
    const { category_id } = await req.body;
    const categories = read('categories');

    try {
      const categoryIndex = categories.findIndex(c => c.category_id == category_id);
      if (categoryIndex == -1) {
        throw new Error('category is not found, enter existing category_id...')
      }
      categories.splice(categoryIndex, 1)
      write('categories', categories)
      res.json(200, { status: 204, message: 'category is successfully deleted!' })
    } catch (error) {
      res.json(500, { status: 500, message: error.message })
    }
  }
};