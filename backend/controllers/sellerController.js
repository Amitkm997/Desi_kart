import Seller from '../models/seller.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';
import transporter from '../config/email.js';
// @desc     Auth user & get token
// @method   POST
// @endpoint /api/sellers/login
// @access   Public
const loginSeller = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      res.statusCode = 404;
      throw new Error(
        'Invalid email address. Please check your email and try again.'
      );
    }

    const match = await bcrypt.compare(password, seller.password);

    if (!match) {
      res.statusCode = 401;
      throw new Error(
        'Invalid password. Please check your password and try again.'
      );
    }

    generateToken(req, res, seller._id);

    res.status(200).json({
      message: 'Login successful.',
      sellerId: seller._id,
      name: seller.name,
      email: seller.email,
      isAdmin: seller.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Register seller
// @method   POST
// @endpoint /api/sellers
// @access   Public
const registerSeller = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const sellerExists = await Seller.findOne({ email });

    if (sellerExists) {
      res.statusCode = 409;
      throw new Error('Seller already exists. Please choose a different email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Seller({
      name,
      email,
      password: hashedPassword
    });

    await seller.save();

    generateToken(req, res, seller._id);

    res.status(201).json({
      message: 'Registration successful. Welcome!',
      sellerId: seller._id,
      name: seller.name,
      email: seller.email,
      isAdmin: seller.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Logout seller / clear cookie
// @method   POST
// @endpoint /api/sellers/logout
// @access   Private
const logoutSeller = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });

  res.status(200).json({ message: 'Logout successful' });
};

// @desc     Get seller profile
// @method   GET
// @endpoint /api/sellers/profile
// @access   Private
const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      res.statusCode = 404;
      throw new Error('Seller not found!');
    }

    res.status(200).json({
      message: 'Seller profile retrieved successfully',
      sellerId: seller._id,
      name: seller.name,
      email: seller.email,
      isAdmin: seller.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get admins
// @method   GET
// @endpoint /api/sellers/admins
// @access   Private/Admin
const admins = async (req, res, next) => {
  try {
    const admins = await Seller.find({ isAdmin: true });

    if (!admins || admins.length === 0) {
      res.statusCode = 404;
      throw new Error('No admins found!');
    }
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

// @desc     Get sellers
// @method   GET
// @endpoint /api/sellers
// @access   Private/Admin
const getSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find({ isAdmin: false });

    if (!sellers || sellers.length === 0) {
      res.statusCode = 404;
      throw new Error('No sellers found!');
    }
    res.status(200).json(sellers);
  } catch (error) {
    next(error);
  }
};
// @desc     Get seller
// @method   GET
// @endpoint /api/sellers/:id
// @access   Private/Admin
const getSellerById = async (req, res, next) => {
  try {
    const { id: sellerId } = req.params;
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      res.statusCode = 404;
      throw new Error('Seller not found!');
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

const updateSeller = async (req, res, next) => {
  try {
    const { name, email, isAdmin } = req.body;
    const { id: sellerId } = req.params;
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      res.statusCode = 404;
      throw new Error('Seller not found!');
    }
    seller.name = name || seller.name;
    seller.email = email || seller.email;
    seller.isAdmin = Boolean(isAdmin);

    const updatedSeller = await seller.save();

    res.status(200).json({ message: 'Seller updated', updatedSeller });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

const updateSellerProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      res.statusCode = 404;
      throw new Error('Seller not found. Unable to update profile.');
    }

    seller.name = name || seller.name;
    seller.email = email || seller.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      seller.password = hashedPassword;
    }

    const updatedSeller = await seller.save();

    res.status(200).json({
      message: 'Seller profile updated successfully.',
      sellerId: updatedSeller._id,
      name: updatedSeller.name,
      email: updatedSeller.email,
      isAdmin: updatedSeller.isAdmin
    });
  } catch (error) {
    next(error);
  }
};

const deleteSeller = async (req, res, next) => {
  try {
    const { id: sellerId } = req.params;
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      res.statusCode = 404;
      throw new Error('Seller not found!');
    }
    await Seller.deleteOne({ _id: seller._id });
    res.status(200).json({ message: 'Seller deleted' });
  } catch (error) {
    next(error);
  }
};

const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller) {
      res.statusCode = 404;
      throw new Error('Seller not found!');
    }

    const token = jwt.sign({ sellerId: seller._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });
    const passwordResetLink = `https://mern-shop-abxs.onrender.com/reset-password/${seller._id}/${token}`;
    console.log(passwordResetLink);
    await transporter.sendMail({
      from: `"MERN Shop" ${process.env.EMAIL_FROM}`, // sender address
      to: seller.email, // list of receivers
      subject: 'Password Reset', // Subject line
      html: `<p>Hi ${seller.name},</p>

            <p>We received a password reset request for your account. Click the link below to set a new password:</p>

            <p><a href=${passwordResetLink} target="_blank">${passwordResetLink}</a></p>

            <p>If you didn't request this, you can ignore this email.</p>

            <p>Thanks,<br>
            MERN Shop Team</p>` // html body
    });

    res
      .status(200)
      .json({ message: 'Password reset email sent, please check your email.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { id: sellerId, token } = req.params;
    const seller = await Seller.findById(sellerId);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      res.statusCode = 401;
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    seller.password = hashedPassword;
    await seller.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    next(error);
  }
};

export {
  loginSeller,
  registerSeller,
  logoutSeller,
  getSellerProfile,
  getSellers,
  getSellerById,
  updateSeller,
  updateSellerProfile,
  deleteSeller,
  admins,
  resetPasswordRequest,
  resetPassword
};
