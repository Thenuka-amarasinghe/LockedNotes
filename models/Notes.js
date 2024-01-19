const client = require('../dbConnection');
const collection = client.db().collection('Notes');

function postNotes(note, callback) {
    collection.insertOne(note, callback);
}

function getAllNotes(callback) {
    collection.find({}).toArray(callback);
}

function updateNote(noteId, updatedNote, callback) {
    collection.updateOne({ _id: noteId }, { $set: updatedNote }, callback);
}

function deleteNote(noteId, callback) {
    collection.deleteOne({ _id: noteId }, callback);
}

module.exports = { postNotes, getAllNotes, updateNote, deleteNote };
