const express = require('express');
const viewsController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/forgot-password', viewsController.getForgotPassword);
router.get('/signup', viewsController.getSignupForm);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;
