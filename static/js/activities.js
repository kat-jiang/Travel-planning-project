"use strict";

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
    <div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4 d-flex aline-items-center">
          <img src="${imageUrl}" class="img-fluid rounded-start">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              ${name} <br> Rating: ${rating}
            </h5>
            <h6>
              Categories: ${categories}
            </h6>
            <p class="card-text">
              ${address}
              <br>
              ${displayPhone}
            </p>
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
    display_search_cards(activities)
    createMapMarkers(activities)
  });
};

function getRestaurantSearch(evt) {
  evt.preventDefault();

  const trip_id = document.querySelector('#trip_id').value;

  fetch(`/api/restaurants?trip_id=${trip_id}`)
  .then(response => response.json())
  .then(restaurants => {
    display_search_cards(restaurants)
    createMapMarkers(restaurants)
  });
};

function getSearchResults(evt) {
  evt.preventDefault();

  const formInputs = {
    trip_id: document.querySelector('#trip_id').value,
    search: document.querySelector('#search-yelp').value
  };

  fetch('/api/search', {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(results => {
      display_search_cards(results);
      createMapMarkers(results)
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

// -------- DISPLAY MAP FROM MAPBOX -------- //

mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0amlhbmciLCJhIjoiY2wwdWh3NnRqMHhoODNrcW9yaXY5N2VnayJ9.HDKyR2oAhjjbkMOzSpI5-A';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-98.5795, 39.8283], // starting position [lng, lat]
  zoom: 4, // starting zoom
  hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
});

// -------- CREATE MARKERS FOR MAP -------- //

const createMapMarkers = (results) => {
  const currentMarkers = [];

  for (const result of results) {
    const name = result.name;
    const rating = result.rating;
    const longitude = result.coordinates.longitude;
    const latitude =  result.coordinates.latitude;

    // create div for marker
    // const el= document.createElement('div');
    // el.className = 'marker';
    // add popup and marker to the map
    const marker = new mapboxgl.Marker()
    .setLngLat([`${longitude}`, `${latitude}`])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h5>${name}</h5><p>Rating: ${rating}</p>`
        )
    )
    currentMarkers.push(marker);
    // .addTo(map);
  }
  for (const marker of currentMarkers) {
    marker.addTo(map)
  };
};