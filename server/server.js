const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

// const Todo = mongoose.model('Todo', {
//     text: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     },
//     completedAt: {
//         type: Number
//     }

// });

// // const newTodo = new Todo({
// //     text: 'Visit Grandma',
// //     completed: true,
// //     completedAt: 122
// // });

// // newTodo.save().then((todo) => {
// //     console.log(todo)
// // }, (err) => {
// //     console.log('Unable to save Todo');
// // });

// const User = mongoose.model('Users', {
//     email: {
//         type: String,
//         trim: true,
//         required: true,
//         minlength: 1
//     }
// })

// const newUser = new User({
//     email: ''
// });

// newUser.save().then((doc) => {
//     console.log(doc);
// }, (err) => {
//     console.log("Unable to save doc", err);
// });