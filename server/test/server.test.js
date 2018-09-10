const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: "Todo 1"
}, {
    _id: new ObjectID(),
    text: "Todo 2"
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
        const text = 'This is a test todo';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if (err) {
                return done(err)
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create a new todo with invalid data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {
                done(e);
            });
        });

    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done)
    });

    it('should return a note', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${(new ObjectID()).toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return a 400 if the id is invalid', (done) => {
        request(app)
        .get(`/todos/1232`)
        .expect(404)
        .end(done);
    });
});

// describe('DELETE /todos/:id', () => {
//     it('should delete a todo', (done) => {
//         const hexId = todos[1]._id.toHexString();
//         request(app)
//         .delete(`/todos/${hexId}`)
//         .expect(200)
//         .expect((res) => {
//             expect(res.body.todo._id).toBe(hexId);
//         })
//         .end((err, res) => {
//             if (err) {
//                 return done(err);
//             }
//             Todo.findById(hexId).then((todo) => {
//                 expect(todo).toNotExist();
//                 done();
//             }).catch((e) => done(e))
//         })
//     });
    // it('should return 404 if todo not found', (done) => {
    //     const hexId = todo[1]._id.toHexString();

//     // })
// })

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      var hexId = todos[1]._id.toHexString();
      request(app)
        .get('/todos').then((data)=> console.log(data.body));
        // console.log(data);
        console.log(hexId);
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          Todo.findById(hexId).then((todo) => {
            expect(todo).toBe(null);
            done();
          }).catch((e) => done(e));
        });
    });


  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });


});  
