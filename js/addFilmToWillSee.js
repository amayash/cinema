'use strict'


document.querySelector("#filmPicture").addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        document.querySelector("#tempPicture").src = uploaded_image;
    });
    reader.readAsDataURL(this.files[0]);
});

function addItemToTable(name, country, year, genre) {
    console.info('Try to add item');

    const table = document.querySelector("#tbl-items tbody");
    if (table == null) {
        throw 'Table is not found';
    }

    const id = 'item-' + Date.now();

    const tableHtml = 
    '<tr id="' + id + '"><img class="poster me-3 img-fluid" src="'+document.getElementById("tempPicture").src+'" alt="'+name+'" align="left">\
    <div class="d-flex flex-row flex-wrap  flex-grow-1 align-items-center">\
        <div class="pt-3 description d-flex flex-column justify-content-start align-items-center mb-3 fs-6 fw-bold">\
            <p class="text-start description">\
            <a class="text-white fs-5 fw-bold pt-3" href="film.html">'+name+'</a><br>'
            +country+', '+ year+' г.<br>'+
            genre+'</p></div>\
            <div id="rightPanel"\
			class="d-flex flex-wrap justify-content-end text-white fw-bold fs-4 flex-grow-1">\
			<div class="rounded p-1 mx-2 green-mark">9.2</div>\
			<a href=# onclick="removeItemFromTable(\''+ id +'\')"><i class="fa-solid fa-trash"></i></a>\
		</div>\
    </div>' +
    '</tr><hr class="border border-0 bg-black">';

    table.innerHTML += tableHtml;

    console.info('Added');
}

function removeItemFromTable(id) {
    console.info('Try to remove item');

    if (!confirm('Do you really want to remove this item?')) {
        console.info('Canceled');
        return;
    }

    const item = document.querySelector('#' + id);
    if (item == null) {
        throw 'Item with id [' + id + '] is not found';
    }
    item.remove();

    const numbers = document.querySelectorAll("#tbl-items tbody tr th");
    for (let i = 0; i < numbers.length; i++) {
        numbers[i].innerHTML = i + 1;
    }

    console.info('Removed');
}

document.addEventListener('DOMContentLoaded', function () { 
    console.info('Loaded');

    const form = document.querySelector("#frm-items");
    if (form !== null) {
        form.addEventListener('submit', function(event) {
            console.info('Form onsubmit');
            event.preventDefault();

            const pic = document.querySelector("#filmPicture");
            if (pic == null) {
                throw 'Pic control is not found';
            }

            const name = document.querySelector("#filmName");
            if (name == null) {
                throw 'name control is not found';
            }

            const country = document.querySelector("#filmCountry");
            if (country == null) {
                throw 'desc control is not found';
            }

            const year = document.querySelector("#filmYear");
            if (year == null) {
                throw 'name control is not found';
            }

            const genre = document.querySelector("#filmGenre");
            if (genre == null) {
                throw 'name control is not found';
            }

            addItemToTable(name.value, country.value,parseInt(year.value),genre.value);

            pic.value = '';
            name.value = '';
            country.value = '';
            year.value = 1900;
            genre.value = '';
        });
    }
});