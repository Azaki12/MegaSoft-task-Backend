/* eslint-disable prettier/prettier */
const express = require('express');
const bookmarksController = require('../controllers/bookmarkController/bookmarkcontroller');

const router = express.Router();

router.route('/').post(bookmarksController.addBookmark);

router.route('/:id').get(bookmarksController.getAllBookmarks);

router.route('/:id/:userId').delete(bookmarksController.deleteBookmark);
module.exports = router;
