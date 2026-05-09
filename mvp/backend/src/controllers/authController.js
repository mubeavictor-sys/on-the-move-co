const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
  const { role, full_name, email, phone, password, kra_pin } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (role, full_name, email, phone, password_hash, kra_pin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role, full_name, email, phone',
      [role, full_name, email, phone, passwordHash, kra_pin]
    );

    const user = newUser.rows[0];

    if (role === 'runner') {
      await db.query('INSERT INTO runners (user_id) VALUES ($1)', [user.id]);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    delete user.password_hash;
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
};
