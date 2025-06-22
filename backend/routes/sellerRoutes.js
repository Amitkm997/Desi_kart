import express from 'express';
import {
  loginSeller,
  registerSeller,
  logoutSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellers,
  deleteSeller,
  updateSeller,
  getSellerById,
  admins,
  resetPasswordRequest,
  resetPassword
} from '../controllers/sellerController.js';
import { protectSeller, sellerAdmin } from '../middleware/sellerAuthMiddleware.js';
import validateRequest from '../middleware/validator.js';
import {body, param} from 'express-validator';

const router = express.Router();
const validator = {
  checkLogin: [
    body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address"),
    body('password').trim().isString().notEmpty().withMessage('Password is Empty')
  ],
  checkNewSeller: [
    body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address"),
    body('password').trim().isString().notEmpty().withMessage('Password is Empty').bail()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is Required').escape()
  ],
  checkGetSellerById: [
    param('id').exists().withMessage('Id is required').isMongoId().withMessage('Invalid Id')
  ],
  checkUpdateSeller: [
    body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address"),
    body('name').trim().notEmpty().withMessage('Name is Required').escape(),
    body('isAdmin').isBoolean().withMessage('isAdmin value should be true/false'),
    param('id').exists().withMessage('Id is required').isMongoId().withMessage('Invalid Id')
  ],
  resetPasswordRequest: [
    body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address")
  ],
  resetPassword: [
    body('password').trim().notEmpty().withMessage('Password is Required').escape().bail()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    param('id').exists().withMessage('Id is required').isMongoId().withMessage('Invalid Id'),
    param('token').trim().notEmpty().withMessage('Token is Required')
  ]
}

router.route('/')
  .post(validator.checkNewSeller, validateRequest, registerSeller)
  .get(protectSeller, sellerAdmin, getSellers);

router.route('/admins').get(protectSeller, sellerAdmin, admins);

router.post('/reset-password/request', validator.resetPasswordRequest, validateRequest, resetPasswordRequest);
router.post('/reset-password/reset/:id/:token', validator.resetPassword, validateRequest, resetPassword);
router.post('/login', validator.checkLogin, validateRequest, loginSeller);
router.post('/logout', protectSeller, logoutSeller);

router
  .route('/profile')
  .get(protectSeller, getSellerProfile)
  .put(validator.checkNewSeller, validateRequest, protectSeller, updateSellerProfile);

router
  .route('/:id')
  .get(validator.checkGetSellerById, validateRequest, protectSeller, sellerAdmin, getSellerById)
  .put(validator.checkUpdateSeller, validateRequest, protectSeller, sellerAdmin, updateSeller)
  .delete(validator.checkGetSellerById, validateRequest, protectSeller, sellerAdmin, deleteSeller);

export default router;
