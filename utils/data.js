const usernames = ['Bob', 'Tom', 'Joe'];
const emails = ['bob@gmail.com','tom@gmail.com','joe@gmail.com'];

const thoughts = [];
for (let i = 0; i < 3; i++) {
    thoughts.push({
        thoughtText: `This is thought ${i + 1}`,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        createdAt: new Date()
    });
};

module.exports = { usernames, emails, thoughts};