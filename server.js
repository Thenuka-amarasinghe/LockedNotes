let express = require('express');
let app = express();
let port = process.env.port || 3000;
require('./dbConnection');
let router = require('./routers/router');
const { Socket } = require('socket.io');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwt_Secret = 'thisisastringthatissupposedtobesecret123129!#$%^&*!#(!#)_312039812903809128'

mongoose.connect('mongodb://127.0.0.1:27017/login-LockedNotes')

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/Notes',router);

//Using bodyParser to read JSON data
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.redirect('/HomePage.html');
});

app.post('/api/register', async (req, res) => {
    console.log(req.body)

    const{ username, password : plainTextPassword, email } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({status: 'error', error: 'Username is invalid'})
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({status: 'error', error: 'Password is invalid'})
    }

    if (plainTextPassword.length < 5) {
        return res.json({status: 'error', error: 'Password should be at least 6 characters'})
    }

    const password = await bcrypt.hash(toString(plainTextPassword), 10)
    console.log('register password', password)

    try {
        const response = await User.create({
            username,
            password,
            email
        })
        console.log('User created successfully', response)
    } catch (error) {
        console.log(error)
        

        if(error.code === 11000) {
        //This error code matches to duplicate key i.e. username is already in use
            return res.json({status: 'error', error: 'Username already in use'})
        }
        return res.json({ status: 'error'})
    }

    res.json({status: 'ok'})
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check that user exists
        const user = await User.findOne({ username }).lean();

        // If no matching user account to username found, let the user know
        if (!user) {
            console.error("User not found")
            return res.json({ status: 'error', error: 'Invalid username/password' });
        }

        passwordString = toString(password)
        // Compare the provided password with the hashed password stored for the user
        if (await bcrypt.compare(passwordString, user.password)) {
            // If the password comparison is successful, proceed with login

            // Use JWT to sign a token
            const token = jwt.sign({ 
                id: user._id, 
                username: user.username
            }, jwt_Secret);

            // Set the token as a cookie or in the response header
            // res.cookie('token', token); 

            return res.json({ status: 'ok', data: token});

        } else {
            // If the password comparison fails, let the user know
            console.error("Wrong password!")
            res.json({ status: 'error', data: 'Invalid username/password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', error: 'Internal Server Error: login failed' });
    }
});

io.on('connection',(socket)=>{
    console.log('User Connected');
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

http.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});