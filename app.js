/* eslint-disable prettier/prettier */
const express = require('express');

const app = express();
const morgan = require('morgan');
// gets the routers from their files
const postsRouter = require('./routes/postsRoutes');
const userRouter = require('./routes/userRoutes');
const bookmarksRouter = require('./routes/bookmarkRoutes');
const APPError = require('./utils/app-error');
const errorHandler = require('./controllers/errorController/errorController');
//----------------------------------MIDDLEWARES------------------------//

if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); // package for logging

// middleWare for modifying the comming data from the user
// mainly used to modify the request to be able to hold the data
// "use" method addes a middleware to the middleware stack
app.use(express.json());

// adding a static files to be used (imgs, htmls...etc) not folders
app.use(express.static(`${__dirname}/public`));

// connecting the toursRouter to the app
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookmarks', bookmarksRouter);

// runs for all API MEthods '*' means that every routes
//! this route must be in the end after all routes are handled as its the defualt route when a route is not found
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find ${req.originalUrl} on this server, please check back with the backend team`,
  // });

  // when passing an arg to next then its error
  // so all middlewares are skiped
  // and it will automatically use the error middleware
  next(
    new APPError(
      `Cant find ${req.originalUrl} on this server, please check back with the backend team`,
      404,
    ),
  );
});

// error handling middleware
app.use(errorHandler);

module.exports = app;
