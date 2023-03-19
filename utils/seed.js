const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { usernames, emails, thoughts } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  async function seedDatabase() {
    try {
      await User.deleteMany({});
      await Thought.deleteMany({});

      const users = await User.insertMany(
        usernames.map((username, i) => ({ username, email: emails[i] }))
      );

      const thoughtsWithUsers = thoughts.map((thought, i) => {
        const user = users[Math.floor(Math.random() * users.length)];
        return {
          ...thought,
          userId: user._id,
          username: user.username,
        };
      });

      const createdThoughts = await Thought.insertMany(thoughtsWithUsers);

      for (const thought of createdThoughts) {
        await User.findByIdAndUpdate(
          thought.userId,
          { $push: { thoughts: thought._id } },
          { new: true, runValidators: true }
        );
      }
      await connection.close();

      console.log("Database OK!");
    } catch (error) {
      console.error("Error", error);
    }
  }

  seedDatabase();
});