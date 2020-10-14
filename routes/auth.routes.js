const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = Router();
const config = require('config');

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Введите коректный email').isEmail(),
    check('password', 'Минимальная длина 6 символов').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Не коректный данные при регистрации',
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже есть' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'Пользователь создан.' });
    } catch (error) {
      res.status(500).json({ message: 'Что пошло не так, попробуйте снова.' });
    }
  }
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите коректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пороль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Не коректный данные при входе.',
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const isMatch = await bcrypt.compare(password.user.password);

      if (!isMatch) {
        return res.status(400).json({ massage: 'Не верный пороль' });
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      );

      res.json({ token, userId: user.id });
      // const candidate = await User.findOne({ email });

      // if (candidate) {
      //   return res.status(400).json({ message: 'Такой пользователь уже есть' });
      // }

      // const hashedPassword = await bcrypt.hash(password, 10);

      // const user = new User({ email, password: hashedPassword });
      // await user.save();
      // res.status(201).json({ message: 'Пользователь создан.' });
    } catch (error) {
      res.status(500).json({ message: 'Что пошло не так, попробуйте снова.' });
    }
  }
);

module.exports = router;
