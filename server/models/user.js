const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    })
}

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, '123abc');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcryptjs.genSalt(10, function (err, salt) {
            bcryptjs.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;
    return User.findOne({email: email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcryptjs.compare(password, user.password, (err, result) => {
                if(result) {
                    return resolve(user);
                }
                else {
                    return rejct();
                }
            })
        })
    })
}

const User = mongoose.model('Users', UserSchema);

module.exports = {User};