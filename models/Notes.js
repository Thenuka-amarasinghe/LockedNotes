let client = require('../dbConnection');

let collection = client.db().collection('Notes');

function postNotes(Notes, callback) {
    collection.insertOne(Notes,callback);
}

function getAllNotes(callback) {
    collection.find({}).toArray(callback);
}

module.exports = {postNotes,getAllNotes}