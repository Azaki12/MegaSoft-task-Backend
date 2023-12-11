/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

// creating a schema for a table/collection (making the headers of the table)
const bookmarkSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Posts',
  },

  userIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

// making a model out of the schema
const Bookmarks = mongoose.model('Bookmarks', bookmarkSchema);

module.exports = Bookmarks;
