require('./config/config');

const {mongoose} = require('./db/mongoose');
const _ = require('lodash');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const {authenticate} = require('./middleware/authenticate');
const app = express();
const {ObjectId} = require('mongodb'); 
const port = process.env.PORT;

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
    Todo.findOneAndRemove({_id: id}).then((todo) => {
        if(!todo) {
            return res.status(404).send("Error: Todo not found with the given id");    
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send("Error: 400");
    })

});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectId.isValid(id)) {
        return res.status(404).send('Error: Invalid todo id');
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
        console.log(body.completedAt)
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {$new: true}).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.send(400).send();
    });

});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
        //res.status(200).send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

module.exports = {app};
