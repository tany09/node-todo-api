const mongoose = require('mongoose');

const User = mongoose.model('Users', {
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 1
    }
})

module.exports = {
    User
};