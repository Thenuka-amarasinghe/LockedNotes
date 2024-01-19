const collection = require('../models/Notes');

const postNotes = (req, res) => {
    let Notes = req.body;
    collection.postNotes(Notes, (err, result) => {
        if (!err) {
            res.json({ statusCode: 201, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        }
    });
};

const getAllNotes = (req, res) => {
    collection.getAllNotes((error, result) => {
        if (!error) {
            res.json({ statusCode: 200, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        }
    });
};

const deleteNotes = (req, res) => {
    let Notes = req.body; // Assuming you send the noteId in the request body
    collection.deleteNote(Notes.noteId, (err, result) => {
        if (!err) {
            res.json({ statusCode: 200, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        }
    });
};

module.exports = { postNotes, getAllNotes, deleteNotes };
