/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

// where evrythings starts
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

// dealing with depraction warnings
// return promise (future)
// use "database" variabe here to connect to the shared one instead of "process.env.DATABASE_LOCAL"
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB Connection successful');
  });

const app = require('./app');

// save variables from the config.env and use them inside the code
const port = process.env.PORT || 3000;

const connectionHanddler = () => {
  console.log('Connection establised');
};

//--------------------------Start Server-----------------------------------//
// function that creats the server and listens to it
// connects to the "port" and upon listening do the stuff inside the call back function
app.listen(port, connectionHanddler);
