const client = require('../dbConnection');
const collection = client.db().collection('Notes');

function postNotes(note, callback) {
    collection.insertOne(note, callback);
}

function getAllNotes(callback) {
    collection.find({}).toArray(callback);
}

async function deleteNote(id, callback) {
    const objectId = require('mongodb').ObjectId;
    console.log('Delete api called in Notes.js. Id=', id);
    console.log(`No.of occurences of ${id} =`, await collection.findOne({ _id: objectId(id) }));
    
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

module.exports = { postNotes, getAllNotes, deleteNote};
