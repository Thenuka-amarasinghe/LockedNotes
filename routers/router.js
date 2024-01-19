const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/', (req, res) => {
    controller.postNotes(req, res);
});

router.get('/', (req, res) => {
    controller.getAllNotes(req, res);
});

module.exports = router;
