const mongoose = require('mongoose');
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        trim: true,
        required: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }

});

module.exports = {Todo};