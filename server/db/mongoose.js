const mongoose = require('mongoose');
const dotenv = require('dotenv');
mongoose.Promise = global.Promise;

dotenv.config();

mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};