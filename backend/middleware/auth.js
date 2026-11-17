const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../utils/inMemoryStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (global.useInMemory) {
        const user = store.getById('users', decoded.id);
        if (user) {
          req.user = { _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role };
        } else {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, adminOnly };
