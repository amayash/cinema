'use strict'

document.querySelector("#filmPicture").addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result;
        document.querySelector("#tempPicture").src = uploaded_image;
    });
    reader.readAsDataURL(this.files[0]);
});

const items = new Map();

class ItemLine {
    constructor(image, name, country, year, genre) {
        this.image = image;
        this.name = name;
        this.country = country;
        this.year = parseInt(year);
        this.genre = genre;
    }

    static createFrom(item) {
        return new ItemLine(item.image, item.name, item.country, item.year, item.genre);
    }
}

function loadItemsTable() {
    console.info('Try to load data');

    function drawItemsTable() {
        console.info('Try to draw table');

        const table = document.querySelector("#tbl-items tbody");
        if (table == null) {
            throw 'Table is not found';
        }

        fetch("handlebars/items-table.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const template = Handlebars.compile(html);
                table.innerHTML = template({ 'items': Object.fromEntries(items.entries()) });
                console.info('Drawn');
            })
            .catch(function (error) {
                console.error('Error:', error);
                throw "Can't render template";
            });
    }

    fetch("http://localhost:8079/lines")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.info('Loaded');
            items.clear();
            for (let i = 0; i < data.length; i++) {
                const current = data[i];
                items.set(current.id, ItemLine.createFrom(current));
            }
            drawItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't load items";
        });
}

function addItemToTable(image, name, country, year, genre) {
    console.info('Try to add item');

    const itemObject = new ItemLine(image, name, country, year, genre);

    fetch("http://localhost:8079/lines", 
        { 
            method: 'POST', 
            body: JSON.stringify(itemObject),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.info('Added');
            console.log(data);
            
            loadItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't add item";
        });
}

function removeItemFromTable(id) {
    console.info('Try to remove item');

    if (!confirm('Вы действительно хотите удалить фильм из списка запланированных?')) {
        console.info('Canceled');
        return;
    }

    if (!items.has(id)) {
        throw 'Item with id [' + id + '] is not found';
    }

    fetch("http://localhost:8079/lines/" + id,
        {
            method: 'DELETE'
        })
        .then(function () {
            console.info('Removed');

            loadItemsTable();
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw "Can't add item";
        });
}

function loadItemsSelect(select) {
    function drawItemsSelect(select, data) {
        console.info(`Try to load data on ${select.id}`)
        fetch("handlebars/items-select.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const template = Handlebars.compile(html);
                select.innerHTML += template({ 'items': data });
            })
            .catch(function (error) {
                console.error('Error:', error);
                throw "Can't load items";
            });
    }

    fetch(`http://localhost:8079/${select.id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            drawItemsSelect(select, data);
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw `Can't load ${select.id}`;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    console.info('Script Loaded');

    const picture = document.querySelector("#filmPicture");
    if (picture == null) {
        throw 'picture control is not found';
    }

    const name = document.querySelector("#filmName");
    if (name == null) {
        throw 'name control is not found';
    }

    const country = document.querySelector("#filmCountry");
    if (country == null) {
        throw 'country control is not found';
    }

    const year = document.querySelector("#filmYear");
    if (year == null) {
        throw 'year control is not found';
    }

    const genre = document.querySelector("#filmGenre");
    if (genre == null) {
        throw 'genre control is not found';
    }

    const age = document.querySelector("#film16");
    if (age == null ) {
        throw 'age control is not found';
    }

    loadItemsSelect(country);
    loadItemsSelect(genre);
    loadItemsTable();

    const form = document.querySelector("#frm-items");
    if (form !== null) {
        const forms = document.querySelectorAll('.needs-validation-content');

        // Loop over them and prevent submission
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i];
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    console.info('start check validation content');
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');

                if (name.value == '') {
                    throw 'name is empty';
                }

                if (country.value == '') {
                    throw 'country is empty';
                }

                if (genre.value == '') {
                    throw 'genre is empty';
                }

                if (!age.checked) {
                    throw 'you are not 16+';
                }

                console.info('Form onsubmit');
                event.preventDefault();

                addItemToTable(document.getElementById("tempPicture").src, name.value, country.value, parseInt(year.value), genre.value);

                picture.value='';
                name.value = '';
                country.value = '';
                year.value = 1900;
                genre.value = '';

            }, false);
        }
    }

});