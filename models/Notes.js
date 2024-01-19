const client = require('../dbConnection');
const collection = client.db().collection('Notes');

function postNotes(note, callback) {
    collection.insertOne(note, callback);
}

function getAllNotes(callback) {
    collection.find({}).toArray(callback);
}

module.exports = { postNotes, getAllNotes};
