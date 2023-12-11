/* eslint-disable prettier/prettier */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catch-async');
const AppError = require('../../utils/app-error');
const APPError = require('../../utils/app-error');

const signToken = (id) =>
  // making a jwt for the user to be sent later to the user to access protected data (authrization)
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    user,
    token,
    // data: { user },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // getting the email and password from the body of the request
  const { email, password } = req.body;

  // check if the email and password exists in DB
  if (!email || !password) {
    return next(new AppError('Please Provide email and password', 400));
  }

  // check if the user && password is correct
  // since the password is remmoved from the response we get it back
  // by filtering (selecting) the password from the DB ("+" means include the password)
  let user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  // when everything is OK we do the login
  const token = signToken(user._id);
   user = await User.findOne({ email }).select('-password, -__v');
  res.status(200).json({
    status: 'success',
    token: token,
    data: user ,
  });
});

// middleware to check for users if they are logged in or not
exports.authorizeToken = catchAsync(async (req, res, next) => {
  // getting the token of the user and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // verification of the token
  // takes the promise function and then its args
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user still exists
  // if the code reached here then the JWT is verified to be correct and we can be sure that the user ID is correct
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('the user does no longer exists', 401));
  }

  // check if the user changed the password or not after JWT is issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User Recently changed pass', 401));
  }

  // if the code reached here then the token is autorized
  // grant access to data
  req.user = currentUser;
  next();
});

// as middlewares cant be passed any params we make a work around
// using wrapers "..." to make it work
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APPError('You dont have permission to perform this action', 403),
      );
    }
    next();
  };

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from the db

  const user = await User.findById(req.user.id).select('+password');

  // check if the given password is correct

  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new APPError('Your current password is wrong'), 401);
  }

  // if so, update the password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // log the user in, resend the JWT
  createSendToken(user, 201, res);
});
