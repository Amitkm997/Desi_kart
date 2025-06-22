import Seller from '../models/seller.js';
import jwt from 'jsonwebtoken';

// Middleware to protect seller routes by verifying JWT authentication token.
const protectSeller = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Token not provided.');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      res.statusCode = 401;
      throw new Error('Authentication failed: Invalid token.');
    }

    req.seller = await Seller.findById(decodedToken.userId).select('-password');

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if the seller is an admin.
const sellerAdmin = (req, res, next) => {
  try {
    if (!req.seller || !req.seller.isAdmin) {
      res.statusCode = 401;
      throw new Error('Authorization failed: Not authorized as an admin.');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { protectSeller, sellerAdmin }; 