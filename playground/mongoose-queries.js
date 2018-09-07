const {mongoose} = require('./../server/db/mongoose');
const {ObjectId} = require('mongodb');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '5b89565c879b9411a01885ce';

if (!ObjectId.isValid(id)) {
    return console.log('Id not valid');
}

Todo.find({ _id: id}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('Id not found');
    }
    console.log('Todo by id', todo)
}).catch((e) => {
    console.log(e);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo)
});

User.findById(id).then((user) => {
    if(!user) {
        console.log('Id not found');
    }
    console.log('User', user);
})