let globalUsername;

/* Displaying exsiting notes */
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
    console.log('inside formSubmitted() function in app.js');
    let formData = {};
    formData.title = $('#title').val();
    formData.description = $('#description').val().replace(/\n/g, '<br>');
    formData.username = globalUsername;
    formData.userID = 
    postNotes(formData);
    location.reload();
};

function postNotes(Notes){
    console.log('inside postNotes() function in app.js');
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

function getAllNotes() {
    $.get('/api/Notes', (response) => {
        if (response.statusCode === 200) {
            globalUsername= response.username;
            addCards(response.data);
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
            // Populate the update form with existing data
            $('#updateTitle').val(response.data.title);
            $('#updateDescription').val(response.data.description);
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
    let updatedData = {
        title: $('#updateTitle').val(),
        description: $('#updateDescription').val().replace(/\n/g, '<br>')
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
        //capturing username of the successfully logged in user requesting to add a new note
        formSubmitted(globalUsername);
    });

    $('.modal').modal();
    getAllNotes();
});