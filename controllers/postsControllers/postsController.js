/* eslint-disable prettier/prettier */
// const { query } = require('express');
const postsModel = require('../../models/postsModel');
const APIFeatures = require('../../utils/api-features');
const catchAsync = require('../../utils/catch-async');
const APPError = require('../../utils/app-error');
const Bookmarks = require('../../models/bookmarkModel');
const Users = require('../../models/userModel');
// callback function for getting data for better visualtion
// exports. funName for exporting it to another file
exports.getAllPosts = catchAsync(async (request, response, next) => {
  // getting the URL query "what comes after (?) in a URL"
  // getting all data (SELECT * FROM TABLE)
  // to get specific data refer to section 7 >> video 7
  // [And] in short terms "tourModel.find({price:{$lte:300}, rating: {$gte: 3}})"
  // [OR] User.findOne({ $or:[ {'condition_1':param}, {'condition_2':param} ]});
  //  BUILD QUERY
  const features = new APIFeatures(postsModel.find(), request.query)
    .filteringQueryHandler()
    .checkForSortingQuery()
    .checkForFieldQuery()
    .checkForPaginationQuery();

  // EXCUTE THE QUERY
  // the path in the populate is for the thing we want to replace
  // the select is for filtering unwanted data while replacing the data
  // const posts = await features.query.populate({
  //   path: 'userId',
  //   select: '-__v',
  // });
  const posts = await features.query;
  // SEND THE QUERY
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: posts.length,
    data: posts,
  });
});

exports.createPost = catchAsync(async (request, response, next) => {
  const newPost = await postsModel.create(request.body);
  // upon making a new post and that post is bookmarked it will be sasved as bookmark
  if (request.body.isBookmarked) {
    await Bookmarks.create({
      post: newPost._id,
      userId: request.body.userId,
    });
  }

  response.status(201).json({
    status: 'Success',
    data: newPost,
  });
});

exports.getPost = catchAsync(async (request, response, next) => {
  // use the id comming from the request to search in the databse for the tour
  // findById === findOne({_id: request.params.id})
  // using populate('name of the field') will replace the IDs of that field in the response
  // with the right data of it
  const post = await postsModel.findById(request.params.id).populate('userId');

  //!! whenever i want to query anything from the model
  //!! use that model and query the field i want from
  //!! example::
  //!! the following code is to get all the posts which have the comment of "!!!"
  //!! apply this concept for any logic
  // const modPost = await postsModel.find({
  //   'comments.userId':'6566f6b0792b8417043d9b1c'
  // });
  // console.log(modPost);

  if (!post) {
    return next(new APPError('No post Found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: { post },
  });
});

exports.updatePosts = catchAsync(async (request, response, next) => {
  const updatedPost = await postsModel.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true, // only the updated document is returned/viewed in postman
      runValidators: true,
    },
  );
  if (!updatedPost) {
    return next(new APPError('No Post Found with that ID', 404));
  }
  response.status(200).json({
    status: 'success',
    data: { post: updatedPost },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const deletedPost = await postsModel.findByIdAndDelete(req.params.id);
  if (!deletedPost) {
    return next(new APPError('No Post Found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    code: 204,
  });
});

exports.addLike = catchAsync(async (req, res, next) => {
  const post = await postsModel.findById(req.params.postId);
  post.likes += 1;
  post.save();

  res.status(200).json({
    status: 'Success',
    data: [post],
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const post = await postsModel.findById(req.params.postId);
  const user = await Users.findById(req.params.userId);
  post.comments.push({
    userId: req.params.userId,
    comment: req.body.comment,
    userName: user.name,
  });
  post.save();
  res.status(200).json({
    status: 'Success',
    data: [post],
  });
});
