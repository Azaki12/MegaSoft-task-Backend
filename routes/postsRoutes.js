/* eslint-disable prettier/prettier */
const express = require('express');
const postsController = require('../controllers/postsControllers/postsController');
const authController = require('../controllers/auth/auth-controller');

//! Mounting a Router
// creating a new router to wrap all the tours routers inside
// we then use it insted of "app" and later connect the "toursRouter" to the "app" router
// this will enable us to make the code cleaner
// think of this as static global vars in flutter making EndPoints for example
const router = express.Router();

// in this fuction we search for "id" and then with the "val" of it do smth
// router.param('id', tourController.checkID);

//? does the same thing as "app.get('/api/v1/tours', getAllTours);"
//? yet this is better as we can chain more API Methods now
//? in another words grouping togther same methods
//? chaning middleware is used by "," where the first is excucted then the other and etc..
//? chaning is used to check for data before processing with the request

router.route('/add-like/:postId').post(postsController.addLike);
router.route('/add-comment/:userId/:postId').post(postsController.addComment);

router
  .route('/')
  .get(authController.authorizeToken, postsController.getAllPosts)
  .post(postsController.createPost);
router
  .route('/:id')
  .get(postsController.getPost)
  .patch(postsController.updatePosts)
  .delete(
    authController.authorizeToken,
    // authController.restrictTo('admin'), // pass the roles that can get very high protected stuff
    postsController.deletePost,
  );

// exporting (single Object) the router of this file to be used in the app.js
module.exports = router;
