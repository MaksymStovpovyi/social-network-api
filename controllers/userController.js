const { ObjectId } = require('mongoose').Types;
const { User, Thought, reactionSchema } = require('../models');

module.exports = {

// all users
  getUsers: (req, res) => {
    User.find({})
      .select('-__v')
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

// one user
  getSingleUser: (req, res) => {
    User.findOne({ _id: req.params.userId })
      .populate([
        { path: 'thoughts', select: '-__v' },
        { path: 'friends', select: '-__v' },
      ])
      .select('-__v')
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Error!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

// new user
  createUser: (req, res) => {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

 // update
  updateUser: (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Error!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },

 // delete
  deleteUser: (req, res) => {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'Error!' });
                return;
            }
            return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        })
        .then(() => {
            res.json({ message: 'The user deleted' });
        })
        .catch((err) => res.status(400).json(err));
    },
    
 // new friend
  addFriend: (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'Error!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

 // delete a friend
  deleteFriend: (req, res) => {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};
