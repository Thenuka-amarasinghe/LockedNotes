const client = require('../dbConnection');
const collection = client.db().collection('Notes');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String},
    description: { type: String},
    username: { type: String }
}, {collection: 'Notes'});

function postNotes(note, callback) {
    collection.insertOne(note, callback);
}

function getAllNotes(callback) {
    collection.find({}).toArray(callback);
}

async function getNote(id, callback) {
    console.log('GET api by ID called in Notes.js');
    try {
        const objectId = new ObjectId(id);
        const result = await collection.findOne({ _id: objectId });
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

async function deleteNote(id, callback) {
    const objectId = require('mongodb').ObjectId;
    console.log('Delete api called in Notes.js. Id=', id);
    
    //collection.deleteOne({ _id: id }, callback);
    await collection.findOneAndDelete({ _id:objectId(id) }, (err, result) => {
        if (result !== null && result.lastErrorObject.n > 0) {
            console.log(`${result.lastErrorObject.n} document(s) was/were deleted`);
        } else {
            console.log('No document was found to delete.');
        }
    callback(err, result);
    });
}

function updateNote(id, updatedData, callback) {
    console.log('Update api called in Notes.js. Id=', id);
    
    collection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: updatedData },
        { returnDocument: 'after' }, // to get the updated document
        (err, result) => {
            if (result.value) {
                console.log('Note updated successfully:', result.value);
            } else {
                console.log('No document was found to update.');
            }
            callback(err, result.value);
        }
    );
}

const Note = mongoose.model('Note', noteSchema);

module.exports = {postNotes, getAllNotes, getNote, updateNote, deleteNote};
module.exports.Note = Note;