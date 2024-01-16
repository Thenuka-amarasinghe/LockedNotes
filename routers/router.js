let express = require('express');
let router = express.Router();
let controller = require('../controllers/controller');

router.post('/', function(req,res){
    controller.postNotes(req,res);
});

router.get('/', (req,res)=>{
    controller.getAllNotes(req,res);
});

router.delete('/', (req,res)=>{
    controller.getAllNotes(req,res);
});


module.exports = router;