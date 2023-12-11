/* eslint-disable prettier/prettier */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catch-async');
const APPError = require('../../utils/app-error');

exports.getAllUsers = catchAsync(async (request, response, next) => {
  const users = await User.find();

  // SEND THE QUERY
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: users.length,
    data: { users: users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new APPError('No user Found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not yet Definied',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not yet Definied',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not yet Definied',
  });
};
