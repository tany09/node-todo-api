const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const {populateTodos, populateUsers, todos, users} = require('./seed/seed');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');


beforeEach(populateTodos);
beforeEach(populateUsers);

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


describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      var hexId = todos[1]._id.toHexString();
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

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        const text = 'This is a test todo';
        const hexId = todos[0]._id.toHexString();
        request(app)
        .patch(`/todos/${hexId}`)
        .send({text: text, completed: true})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                res.status(400).send()
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo.text).toBe(text);
                expect(todo.completed).toBe(true);
                expect(todo.completedAt).toBeA(number);
                done();
            }).catch((e) => done());
        });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const hexId = todos[1]._id.toHexString();
        const text = 'Second todo item';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({text: text, completed: false})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                res.status(400).send();
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo.text).toBe(text);
                expect(todo.completed).toBe(false);
                expect(todo.completedAt).toBe(null);
                done();
            }).catch((e) => done());
        });
    });
});

describe('GET /users/me', () => {
    it('should return a user if authorized', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
            
        })
        .end(done);
    });

    it('should return 401 if user is not authorized', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});


describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'jagat@example.com';
        const password = '123abc';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.body.email).toBe(email);
            expect(res.body._id).toBeTruthy();
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err) => {
            if (err) {
                done(err)
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                done();
            });

        });
    });

    it('should return validation error if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({email: 'and', password: '123a'})
        .expect(400)
        .end(done);
    });

    it('should not create user if email already exists', (done) => {
        request(app)
        .post('/users')
        .send({email: users[0].email, password: '123abc'})
        .expect(400)
        .end(done);
    });
});





