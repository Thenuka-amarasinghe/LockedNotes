let collection = require('../models/Notes');

const postNotes = (req,res) => {
    let Notes = req.body;
    collection.postNotes(Notes, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

const getAllNotes = (req,res) => {
    collection.getAllNotes((error,result)=>{
        if (!error) {
            res.json({statusCode:200,data:result,message:'success'});
        }
    });
}

const deleteNotes = (req,res) => {
    let Notes = req.body;
    collection.deleteOne(cat, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

module.exports = {postNotes,getAllNotes}