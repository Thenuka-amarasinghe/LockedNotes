const addCards = (items) => {
    items.forEach((item) => {
        let itemToAppend =
            '<div class="col s12">' +
            '<div class="card">' +
            '<div class="card-content">' +
            '<span class="card-title">' +
            item.title +
            '</span>' +
            '<p>' +
            item.description +
            '</p></div>' +
            '<div class="card-action right-align">' +
            '<a class="btn btn-rounded transparent-btn update-note-btn" data-note-id=' +
            item._id +
            '><i class="material-icons orange-text">edit</i></a>' +
            '<a class="btn btn-rounded transparent-btn delete-note-btn" data-note-id=' +
            item._id +
            '><i class="material-icons orange-text">delete</i></a>' +
            '</div></div></div>';
        $("#card-section").append(itemToAppend);
    });
        // Attaching click event listener to the delete button
        $('#card-section').on('click', '.delete-note-btn', function() {
            var noteId = $(this).data('note-id');
            console.log('Attaching click event listener to the delete button in each card');
            console.log('deleteNote method in app.js for ID = ', noteId);
            console.log('deleteNode method called');
            deleteNote(noteId);
        });

        // Attaching click event listener to the update button
        $('#card-section').on('click', '.update-note-btn', function() {
            var noteId = $(this).data('note-id');
            console.log('Attaching click event listener to the update button in each card');
            console.log('updateNote method in app.js for ID = ', noteId);
            console.log('updateNode method called');
            openUpdateForm(noteId);
        });
};

const formSubmitted = () => {
    let formData = {};
    formData.title = $('#title').val();
    formData.description = $('#description').val().replace(/\n/g, '<br>');
    formData.username = sessionStorage.getItem('username');
    // formData.userID = 
    postNotes(formData);
    location.reload();
};

function postNotes(Notes){

    // retrieve encryption key from session storage and encrypt notes
    try {
        const clientKey = sessionStorage.getItem('clientKey');
        const encryptedTitle = CryptoJS.AES.encrypt(Notes.title, clientKey).toString(); 
        const encryptedDescription = CryptoJS.AES.encrypt(Notes.description, clientKey).toString(); 
        console.log("Note before encryption:", Notes);
        
        Notes.title = encryptedTitle;
        Notes.description = encryptedDescription;
        console.log("Note after encryption:", Notes);

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
    } catch (error) {
        console.error(error);
    }
}

function getAllNotes() {
    console.log('Getting all notes');
    $.get('/api/getNotes', (response) => {
        if (response.statusCode === 200) {
            const clientKey = sessionStorage.getItem('clientKey');
            const notes = response.data;
            notes.forEach(note => {
                const decryptedTitle = CryptoJS.AES.decrypt(note.title, clientKey).toString(CryptoJS.enc.Utf8);
                const decryptedDescription = CryptoJS.AES.decrypt(note.description, clientKey).toString(CryptoJS.enc.Utf8);
                
                note.title = decryptedTitle;
                note.description = decryptedDescription;
            });
            addCards(notes);
        }
    });
}

const deleteNote = (id) => {
    console.log('deleteNote method in app.js. ID = ', id);
    $.ajax({
        url: `/api/Notes/${id}`,
        method: 'DELETE',
        success: function(response) {
            // Process the successful deletion
            console.log(`Deleting note with ID: ${id}`);
            console.log('Deleted successfully', response);
            
            // to remove the corresponding card from the UI, function removeCard is called
            removeCard(id);
        },
        error: function(error) {
            console.error('Error deleting item by ID:', error);
        }
    });
};

const removeCard = (id) => {
    console.log('removeCard method in app.js');
    // Use the id to find and remove the corresponding card
    // the element with the specified id attribute is found and its parent element is removed,
    // which is the whole card container, like <div class="col s12">)
    $(`[data-note-id="${id}"]`).closest('.col.s12').remove();
};

function openUpdateForm(noteId) {
    console.log('openUpdateForm method in app.js. ID = ', noteId);
    // Fetch the existing note data
    $.get(`/api/Notes/${noteId}`, (response) => {
        if (response.statusCode === 200) {

            // retrieve clientKey and decrypt note
            const clientKey = sessionStorage.getItem('clientKey');
            const decryptedTitle = CryptoJS.AES.decrypt(response.data.title, clientKey).toString(CryptoJS.enc.Utf8);
            const decryptedDescription = CryptoJS.AES.decrypt(response.data.description, clientKey).toString(CryptoJS.enc.Utf8);

            // Populate the update form with existing data
            $('#updateTitle').val(decryptedTitle);
            $('#updateDescription').val(decryptedDescription);
            // Show the update modal
            $('#updateNoteModal').modal('open');
            $('#updateNoteBtn').click(() => {
                updateNote(noteId);
            });
        }
    });
}

function updateNote(id) {
    console.log('updateNote method in app.js. ID = ', id);

    const clientKey = sessionStorage.getItem('clientKey');

    let updatedData = {
        title: CryptoJS.AES.encrypt($('#updateTitle').val(), key).toString(),
        description: CryptoJS.AES.encrypt($('#updateDescription').val().replace(/\n/g, '<br>'), key).toString()
    };

    $.ajax({
        url: `/api/Notes/${id}`,
        method: 'PUT',
        data: updatedData,
        success: function(response) {
            console.log(`Updating note with ID: ${id}`);
            console.log('Updated successfully', response);
            location.reload();
        },
        error: function(error) {
            console.error('Error updating note by ID:', error);
        }
    });
};

//event handler for the "document ready" event.
//Anything inside this function will execute when the HTML document has finished loading.
console.log('outside ready function');
$(document).ready(function () {
    console.log('Event handlers to execute when HTML fnished loading');
    $('.materialboxed').materialbox();

    $('#formSubmit').click(() => {
        formSubmitted(globalUsername);
    });

    $('.modal').modal();
    getAllNotes();
});