const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./../../models/userModel');
dotenv.config({ path: './config.env' });
const Review = require('./../../models/reviewModel');

const dB = process.env.DATABASE;
console.log('Database URL:', dB);

mongoose.connect(dB).then(() => {
  console.log('Connected!');
});

const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');

const importData = async () => {
  try {
    //const userData = JSON.parse(users);
    const reviewData = JSON.parse(reviews);
    // for (const user of userData) {
    //   user.passwordConfirm = user.password;
    // }
    //await User.create(userData);
    await Review.create(reviewData);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
