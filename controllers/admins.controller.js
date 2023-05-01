import { read, hashPassword } from '../utils/model.js';

export default {
  GET: (req, res) => {
    const admins = read('admins');
    let showAdmins = admins.filter(a => delete a.password)
    res.json(200, showAdmins);
  },

  POST: async (req, res) => {
    let { user_name, password } = await req.body;
    const users = read('admins');
    
    try {
      password = hashPassword(password)
      let user = users.find(user => user.user_name == user_name && user.password == password);

      if (!user) {
        throw new Error('wrong username or password...');
      }
      res.json(200, { status: 200, message: 'successfully signed in!' })
    } catch (error) {
      res.json(400, { status: 400, message: error.message });
    }
  },
};