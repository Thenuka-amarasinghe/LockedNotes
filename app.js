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

$(document).ready(function () {
    $('.materialboxed').materialbox();

    $('#formSubmit').click(() => {
        formSubmitted();
    });
    $('.modal').modal();
    getAllNotes();
});

