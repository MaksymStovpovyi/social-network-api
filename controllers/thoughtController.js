const { ObjectId } = require('mongoose').Types;
const { User, Thought, reactionSchema } = require('../models');

module.exports = {

  // all thoughts
  getThoughts: (req, res) => {
    Thought.find({})
      .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // one thoughts
  getSingleThought: (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // new thoughts
  createThought: (req, res) => {
  const { thoughtText, username, userId } = req.body;

  Thought.create({ thoughtText, username, userId })
    .then((thought) => {
      return User.findByIdAndUpdate(
        userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );
    })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'Error!' });
      }

      res.json({ message: 'OK!' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  // update thoughts
  updateThought: (req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    ).then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'Error!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.status(400).json(err));
  },

  // delete
  deleteThought: (req, res) => {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'Error!' });
        }
        return User.findOneAndUpdate(
          { username: deletedThought.username },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
        .then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: 'Error!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
  },

  // new reaction
  createReaction: (req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'Error!' });
          return;
        }
      res.json(dbThoughtData);
    })
      .catch((err) => res.status(400).json(err));
  },

  // delete reaction
  deleteReaction: (req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
    }
  };