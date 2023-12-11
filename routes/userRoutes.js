/* eslint-disable prettier/prettier */
const express = require('express');
const userController = require('../controllers/userControllers/userController');
const authController = require('../controllers/auth/auth-controller');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.patch(
  '/update-password',
  authController.authorizeToken,
  authController.updatePassword,
);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
