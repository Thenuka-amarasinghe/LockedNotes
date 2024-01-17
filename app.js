const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'F6Hh5dRWv8pQ56oRPOmxOQRtJybhR7tR',
  issuerBaseURL: 'https://dev-t2j8fs7v70nslwom.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

function login() {
    auth0.authorize();
}

function logout() {
    auth0.logout();
}

auth0.parseHash((err, result) => {
    if (result && result.accessToken) {
        // User is authenticated
        // You can now fetch the user's encrypted notes or perform other actions
        document.getElementById('notes-container').style.display = 'block';
    } else if (err) {
        console.error('Authentication error:', err);
    }
});




/* This adds html eliments and dispalying the exsting notes with given variables */
const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = 
            '<div class="col s12">'+
                '<div class="card card-size">'+
		            '<div class="card-content center-align">'+
    			        '<span class="card-title activator grey-text text-darken-4">'+item.title+'<i class="material-icons right"></i></span></div>'+
			        '<div class="card-reveal card-size">'+
                    	'<span class="card-title grey-text text-darken-4">'+item.title+'<i class="material-icons right">close</i></span>'+
					    '<p>'+item.description+'</p></div></div></div>';
        $("#card-section").append(itemToAppend)
    });
}

/* Submitting form with data */
const formSubmitted = () => {
    let formData = {};
    formData.title = $('#title').val();
    formData.description = $('#description').val().replace(/\n/g, '<br>');
    console.log(formData);
    postNotes(formData);
}

/* Posting notes to the MongoDB */
function postNotes(Notes){
    $.ajax({
        url:'/api/Notes',
        type:'POST',
        data:Notes,
        success: (result)=>{
            if (result.statusCode === 200) {
                alert('Note added successfully');
                location.reload();
            }
        }
    });
}

/* Getting all notes from the DB */
function getAllNotes(){
    $.get('/api/Notes', (response)=>{
        if (response.statusCode === 200) {
            addCards(response.data);
        }
    });
}

/* Defining commands to run*/
$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('#formSubmit').click(()=>{
        formSubmitted();
    });
    $('.modal').modal();
    getAllNotes();
});

let socket = io();


