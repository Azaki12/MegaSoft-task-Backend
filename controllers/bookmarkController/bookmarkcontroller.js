/* eslint-disable prettier/prettier */
const Bookmarks = require('../../models/bookmarkModel');
const catchAsync = require('../../utils/catch-async');
const APPError = require('../../utils/app-error');
const postsModel = require('../../models/postsModel');

exports.getAllBookmarks = catchAsync(async (req, response) => {
  const bookmarks = await Bookmarks.find({
    //! userIds: { $elemMatch: { $eq: req.params.id } },
    //! same as
    userIds: req.params.id,
  }).populate({
    path: 'post',
    select: '-__v',
  });
  response.status(200).json({
    status: 'success',
    results: bookmarks.length,
    data: bookmarks,
  });
});

exports.addBookmark = catchAsync(async (request, response, next) => {
  const bookmark = await Bookmarks.find({ post: request.body.post });

  if (bookmark.length === 0) {
    await Bookmarks.create({
      post: request.body.post,
      userIds: [request.body.userIds[0]],
    });
    const post = await postsModel.findById(request.body.post);
    post.bookmarkedFrom.push(request.body.userIds);
    post.save();
  } else if (!bookmark[0].userIds.includes(request.body.userIds[0])) {
    bookmark[0].userIds.push(request.body.userIds[0]);
    const post = await postsModel.findById(request.body.post);
    post.bookmarkedFrom.push(request.body.userIds);
    post.save();
    bookmark[0].save();
  } else {
    return next(new APPError('User already bookmarked this post!!', 400));
  }
  response.status(201).json({
    status: 'Success',
    // data: bookmark,
  });
});

exports.deleteBookmark = catchAsync(async (req, res, next) => {
  const bookmark = await Bookmarks.findById(req.params.id);

  const post = await postsModel.findById(bookmark.post);
  const indexOfItem = post.bookmarkedFrom.indexOf(req.params.userId);
  post.bookmarkedFrom.splice(indexOfItem, 1);
  post.save();

  if (post.bookmarkedFrom.length === 0) {
    const deletedPost = await Bookmarks.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return next(new APPError('No Bookmark Found with that ID', 404));
    }
  }

  res.status(200).json({
    status: 'success',
    code: 204,
  });
});
