const { Schema, model } = require('mongoose');

// user model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: { 
        virtuals: true, 
        getters: true 
    },
    id: false
});

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// initialize user model
const User = model('User', userSchema);

module.exports = User;