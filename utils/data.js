const usernames = ['Bob', 'Tom', 'Joe'];
const emails = ['bob@gmail.com','tom@gmail.com','joe@gmail.com'];

const thoughts = [
    {
        thoughtText: 'Some thought... I',
        name: 'Bob',
        createdAt: new Date()
    },
    {
        thoughtText: 'Some thought... II',
        name: 'Tom',
        createdAt: new Date()
    },
    {
        thoughtText: 'Some thought... III',
        name: 'Joe',
        createdAt: new Date()
    }
];

console.log(thoughts);
module.exports = { usernames, emails, thoughts};