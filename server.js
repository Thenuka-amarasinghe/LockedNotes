let express = require('express');
const session = require('express-session');
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
const uuid = require('uuid');

const jwt_Secret = 'thisisastringthatissupposedtobesecret123129!#$%^&*!#(!#)_312039812903809128'
const session_Secret = 'LockedNotes5WVnp,/UhZZG61)PLCn>GLt5[/Kw=Pg[ibeK|gjP>Y$b&<ogD8a6*[}R_Or"VsM'

mongoose.connect('mongodb://127.0.0.1:27017/login-LockedNotes')

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/Notes',router);

//Using bodyParser to read JSON data
app.use(bodyParser.json())

// Adding session management
app.use(session({
    secret: session_Secret,
    resave: false,
    saveUninitialized: false,
  }));

function authenticate(req, res, next) {
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, jwt_Secret, (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

app.get('/AccountPage.html', authenticate, (req, res) => {
    // Access user information using req.user
    res.json({ message: 'Accessing user notes', user: req.user });
  });

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
            userID: uuid.v4(),
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
    console.log('req body', req.body)
        const { username, password } = req.body     
    console.log('username', username, 'password', password)
    passwordString = toString(password)

    console.log('Login password', passwordString)

    //Check that user exists
    const user = await User.findOne({ username }).lean()

    //If no matching user account to username found, let user know
    if(!user) {
        return res.json({ status: 'error', error: 'Invalid username/password'})
    }
    
    console.log('Login password', passwordString)
    if(await bcrypt.compare(passwordString, user.password)){
        //If the password compares and is compatible with the hashed password stored for the user, proceed with login

        //Use JWT to sign a token
        const token = jwt.sign(user, jwt_Secret, {expiresIn: '1h'});
        req.session.token = token;
        return res.json({ status: 'ok', data: token})
    }

    res.json({status: 'error', data: 'Invalid username/password'})


})

function authenticate(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'your-jwt-secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
}

io.on('connection',(socket)=>{
    console.log('User Connected');
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

http.listen(port, ()=>{
    console.log('Express Server Started');
});