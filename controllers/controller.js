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

const getNote = (req, res) => {
    console.log('getNote method in controller.js');
    let id = req.params.id;
    collection.getNote(id, (error, result) => {
        if (!error) {
            res.json({ statusCode: 200, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        }
    });
};

const updateNote = (req, res) => {
    console.log('updateNote method in controller.js');
    let id = req.params.id;
    let updatedData = req.body;
    collection.updateNote(id, updatedData, (error, result) => {
        if (!error) {
            res.json({ statusCode: 200, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        }
    });
};

const deleteNote = (req, res) => {
    let id = req.params.id;    ;
    collection.deleteNote(id, (error, result) => {
        if (!error) {
            res.json({ statusCode: 200, data: result, message: 'success' });
        } else {
            res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
        }
    });
};

module.exports = {
    postNotes,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote
};