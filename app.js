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
};

const formSubmitted = () => {
    let formData = {};
    formData.title = $('#title').val();
    formData.description = $('#description').val().replace(/\n/g, '<br>');
    postNotes(formData);
    location.reload();
};

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

function getAllNotes() {
    $.get('/api/Notes', (response) => {
        if (response.statusCode === 200) {
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

//event handler for the "document ready" event.
//Anything inside this function will execute when the HTML document has finished loading.
console.log('outside ready function');
$(document).ready(function () {
    console.log('Event handlers to execute when HTML fnished loading');
    $('.materialboxed').materialbox();

    $('#formSubmit').click(() => {
        formSubmitted();
    });

    $('.modal').modal();
    getAllNotes();
});

