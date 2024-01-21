const client = require('../dbConnection');
const collection = client.db().collection('Notes');
const { ObjectId } = require('mongodb');

function postNotes(note, callback) {
    collection.insertOne(note, callback);
}

function getAllNotes(callback) {
    collection.find({}).toArray(callback);
}

function getNote(id, callback) {
    console.log('GET api by ID called in Notes.js');
    const objectId = require('mongodb').ObjectId;
    collection.findOne({ _id: objectId }, callback);
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

module.exports = { postNotes, getAllNotes, getNote, updateNote, deleteNote};