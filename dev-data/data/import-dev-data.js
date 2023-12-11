/* eslint-disable prettier/prettier */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postsModel = require('../../models/postsModel');
const Bookmarks = require('../../models/bookmarkModel');

dotenv.config({ path: './config.env' });
const database = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB Connection successful');
  });

// Ready Json File
// use JSON.parse to convert the json to javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// import Data to DB

const importData = async () => {
  try {
    await postsModel.create(tours);
    console.log('Data Loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data from Collection
const deleteData = async () => {
  try {
    // delete all documents in a certain collection (remove all records)
    await postsModel.deleteMany();
    await Bookmarks.deleteMany();
    console.log('Data Deleted');
  } catch (err) {
    console.log(err);
  }
  // stops the app from running
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
