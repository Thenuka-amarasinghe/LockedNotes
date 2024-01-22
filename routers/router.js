const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/', (req, res) => {
    controller.postNotes(req, res);
});

router.get('/', (req, res) => {
    controller.getAllNotes(req, res);
});

router.get('/:id', (req, res) => {
    controller.getNote(req, res);
});

router.put('/:id', (req, res) => {
    console.log('PUT api called in router.js');
    controller.updateNote(req, res);
});

// Delete Notes
//router.delete("/notes/delete/:id", isAuthenticated, deleteNote);
router.delete("/:id", (req, res) => {
    console.log('Delete api called in router.js');
    controller.deleteNote(req, res);
});

module.exports = router;