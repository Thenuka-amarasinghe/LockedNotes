const client = require('../dbConnection');
const collection = client.db().collection('Users');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
},
{collection: 'Users'})

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model