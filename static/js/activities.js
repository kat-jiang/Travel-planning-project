"use strict";
import {config} from "./config.js"

// -------- LIST TO HOLD MAP MARKERS -------- //

let currentMarkers = [];

// -------- DISPLAY MAP FROM MAPBOX -------- //
const tripLat = document.querySelector('#trip-lat').value;
const tripLng = document.querySelector('#trip-lng').value;

mapboxgl.accessToken = config.mapboxApiKey;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [ `${tripLng}` , `${tripLat}` ], // starting position [lng, lat]
  zoom: 9, // starting zoom
  hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
});


// -------- CREATE MARKERS FOR MAP -------- //

const createMapMarkers = (results) => {

  // removing old markers from map, then clear currentmarkers list
  for (const oldMarker of currentMarkers) {
    oldMarker.remove();
  }
  currentMarkers = [];

  for (const result of results) {
    const name = result.name;
    const rating = result.rating;
    const longitude = result.coordinates.longitude;
    const latitude =  result.coordinates.latitude;
    const yelpId = result.id;

    // create popup for the activity
    const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(
      `<h5>${name}</h5>
      <p>Rating: ${rating}</p>`
    )
    // create marker and add to map
    const marker = new mapboxgl.Marker()
    .setLngLat([`${longitude}`, `${latitude}`])
    .setPopup(popup)
    .addTo(map)

    // add markers to currentmarkers list
    currentMarkers.push(marker);

    // Add a custom event listener to the map to close allpopups
    map.on('closeAllPopups', () => {
      popup.remove();
    });

    // adding event listener to the activity card to togglepopup
    const yelpCard = document.querySelector(`#card-${yelpId}`);
    yelpCard.addEventListener('click', (e) => {
      map.fire('closeAllPopups');
      marker.togglePopup();
    });
  }
};

// -------- DISPLAY CARDS -------- //

function display_search_cards(results) {
  // clears anything inside HTML to prevent duplicate request data
  document.querySelector('#display-results').innerHTML = "";

  // loop through results to extract information to display
  for (const result of results) {
    const name = result.name;
    const rating = result.rating;
    const imageUrl = result.image_url;
    const displayPhone = result.display_phone;
    const address = result.location.display_address;
    const id = result.id;

    let categories = ""
    for (const category of result.categories) {
      categories += `${category.title} `
    }

    // make a card for each result
    const cardHtml =
    `
    <div class="card mb-3" id="card-${id}" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4 d-flex aline-items-center">
          <img src="${imageUrl}" class="img-fluid rounded-start">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${name}<br>Rating: ${rating}</h5>
            <h6>Categories: ${categories}</h6>
            <p class="card-text">${address}<br>${displayPhone}</p>
            <p class="card-text">
              <button class="btn btn-primary add-to-itinerary" value="${id}">Add to itinerary</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    `;

    // Display results
    document.querySelector('#display-results').insertAdjacentHTML('beforeend', cardHtml);
  }
};

// -------- FETCH FROM YELP API -------- //

function getActivitySearch(evt) {
  evt.preventDefault();

  const trip_id = document.querySelector('#trip_id').value;

  fetch(`/api/activities?trip_id=${trip_id}`)
  .then(response => response.json())
  .then(activities => {
    display_search_cards(activities);
    createMapMarkers(activities);
  });
};

function getRestaurantSearch(evt) {
  evt.preventDefault();

  const trip_id = document.querySelector('#trip_id').value;

  fetch(`/api/restaurants?trip_id=${trip_id}`)
  .then(response => response.json())
  .then(restaurants => {
    display_search_cards(restaurants);
    createMapMarkers(restaurants);
  });
};

function getSearchResults(evt) {
  evt.preventDefault();

  const trip_id = document.querySelector('#trip_id').value;
  const search = document.querySelector('#search-yelp').value;

  fetch(`/api/search?trip_id=${trip_id}&search=${search}`)
    .then(response => response.json())
    .then(results => {
      display_search_cards(results);
      createMapMarkers(results);
    });
};

document.querySelector('#activities').addEventListener('click', (evt) => {
  getActivitySearch(evt)
});

document.querySelector('#restaurants').addEventListener('click', (evt) => {
  getRestaurantSearch(evt)
});

document.querySelector('#search').addEventListener('click', (evt) => {
  getSearchResults(evt)
});

// -------- ADD ACTIVITIES TO ITINERARY -------- //

const addToItinerary = (evt) => {
  evt.preventDefault();

  const formInputs = {
    yelp_id: evt.target.value,
    trip_id: document.querySelector('#trip_id').value,
  };

  fetch('/add-to-itinerary', {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(response => {
      alert(response);
      // console.log(response);
    });
};

// select display results container
let results = document.querySelector('#display-results');
// check if click is on add-to-itinerary button then call addToItinerary button
results.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('add-to-itinerary')) {
    addToItinerary(evt);
    };

});