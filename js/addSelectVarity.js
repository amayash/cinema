'use strict'

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

    const country = document.querySelector("#filmCountry");
    if (country == null) {
        throw 'country control is not found';
    }

    const genre = document.querySelector("#filmGenre");
    if (genre == null) {
        throw 'genre control is not found';
    }

    loadItemsSelect(country);
    loadItemsSelect(genre);
    
});