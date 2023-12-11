/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const validator = require('validator');
// creating a schema for a table/collection (making the headers of the table)
const postsSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'An author must have a name'],
    validate: [validator.isAlpha, 'your name must be in chars'], //using a third party package for custom validation
  },
  body: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bookmarkedFrom: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  likes: { type: Number, default: 0 },
  comments: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      comment: String,
      userName: String,
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

// making a model out of the schema
const Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts;
