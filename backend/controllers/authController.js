const jwt = require('jsonwebtoken');
const User = require('../models/User');

function buildToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName,
    phone: user.phone,
    location: user.location,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  const { name, email, password, role = 'retailer', businessName = '', phone = '', location = '' } =
    req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const allowedRoles = ['supplier', 'retailer', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      businessName,
      phone,
      location,
    });
    const token = buildToken(user._id);

    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ message: 'Failed to register user' });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = buildToken(user._id);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Failed to login' });
  }
}

async function me(req, res) {
  // req.user is populated by auth middleware
  return res.json({ user: sanitizeUser(req.user) });
}

async function updateProfile(req, res) {
  const { name, email, password, businessName, phone, location } = req.body || {};

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name.trim();

    if (email) {
      const normalized = email.toLowerCase().trim();
      const exists = await User.findOne({ email: normalized, _id: { $ne: user._id } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
      user.email = normalized;
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
      user.password = password; // will be hashed by pre-save hook
    }

    if (typeof businessName === 'string') user.businessName = businessName.trim();
    if (typeof phone === 'string') user.phone = phone.trim();
    if (typeof location === 'string') user.location = location.trim();

    await user.save();
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Update profile error:', err.message);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
}

module.exports = {
  register,
  login,
  me,
  updateProfile,
};
