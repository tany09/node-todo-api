const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {ObjectId} = require('mongodb'); 

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({users});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        res.status(404).send('Error: Invalid todo id');
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send('Error: Todo not found with the given id');
        }
        res.status(200).send(todo);
    }).catch((e) => {
        res.send(400).send('Some error occured');
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

module.exports = {app};


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