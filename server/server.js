const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {ObjectId} = require('mongodb'); 
const port = process.env.PORT || 3000;

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
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send('Some error occured');
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return res.status(404).send('Error: Invalid todo id');
    }
    Todo.findOneAndRemove({_id: '5b92bc4341e1413609ae7715'}).then((todo) => {
        if(!todo) {
            return res.status(404).send("Error: Todo not found with the given id");    
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send("Error: 400");
    })

});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

module.exports = {app};
