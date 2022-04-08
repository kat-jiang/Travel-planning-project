"use strict";
import {config} from "./config.js"
import {formatDate} from "./dateFormatting.js"

// -------- DISPLAY MAP FROM MAPBOX -------- //
mapboxgl.accessToken = config.mapboxApiKey;

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-98.5795, 39.8283], // starting position [lng, lat]
    zoom: 2, // starting zoom
    hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
  });

  // fetch all trip lng/lats to display
  const userId = document.querySelector('#user_id').value;

  fetch(`/api/trips?user_id=${userId}`)
    .then(response => response.json())
    .then(trips => {
      for (const trip of trips) {
        let tripLng = trip.longitude;
        let tripLat = trip.latitude;

        // add popup and marker to the map
        new mapboxgl.Marker()
        .setLngLat([`${tripLng}`, `${tripLat}`])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h5>${trip.trip_name}</h5><p>${trip.trip_location}</p>`
            )
        )
        .addTo(map);
      }
  });

// -------- USE GEOCODING AUTOCOMPLETE IN FORM -------- //

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country,region,district,place'
    });

    geocoder.addTo('#geocoder');

    document.querySelector('#geocoder input').setAttribute('required', true);

    // Get the input form elements.
    const tripLocation = document.querySelector("#geocoder");
    const latitude = document.querySelector('#trip-lat');
    const longitude = document.querySelector('#trip-lng');

    // Add geocoder results to the input form elements
    geocoder.on('result', (e) => {
    tripLocation.value = e.result.place_name;
    latitude.value = e.result.center[1];
    longitude.value = e.result.center[0];
    });

    // Clear results when search is cleared.
    geocoder.on('clear', () => {
    tripLocation.value = '';
    latitude.value = '';
    longitude.value = '';
    });


// -------- ADD TRIP TO DB -------- //

const addTrip = (evt) => {
  evt.preventDefault();

  const formInputs = {
    location: document.querySelector('#geocoder').value,
    latitude: document.querySelector('#trip-lat').value,
    longitude: document.querySelector('#trip-lng').value,
    name: document.querySelector('#trip-name').value,
    start: document.querySelector('#start-date').value,
    end: document.querySelector('#end-date').value,
    user_id: document.querySelector('#user_id').value,
  };
  const url = '/add-trip';

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(userTrip => {
    // add popup and marker to the map
    new mapboxgl.Marker()
    .setLngLat([`${userTrip.longitude}`, `${userTrip.latitude}`])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h5>${userTrip.trip_name}</h5><p>${userTrip.trip_location}</p>`
        )
    )
    .addTo(map);

    const startdateObject = formatDate(userTrip.start_date)
    const enddateObject = formatDate(userTrip.end_date)

    document.querySelector('#get-trips').insertAdjacentHTML('beforeend',
    `
    <div class="card col-md-3" id="trip-${userTrip.trip_id}" style="width: 18rem;">
      <a href="/trip/${userTrip.trip_id}">
        <img src="${userTrip.trip_image}" class="card-img-top">
        <div class="card-body">
          <p class="card-text">
            <h4>${userTrip.trip_name}</h4>
            <h4>${userTrip.trip_location}</h4>
            ${startdateObject} to ${enddateObject}
          </p>
        </div>
      </a>
      <button class="btn btn-secondary delete" trip-id="${userTrip.trip_id}">Delete Trip</button>
    </div>
    `
    );
  })
}

// add an event handler to handle submitting the form
document.querySelector('#add-trip').addEventListener('submit', (evt) => {
  addTrip(evt)
});

// -------- DELETE TRIP FROM DB -------- //

const deleteTrip = (trip_id) => {

  fetch('/delete-trip', {
    method: 'POST',
    body: JSON.stringify({trip_id}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(response => {
      document.querySelector(`#trip-${trip_id}`).remove();
      // alert(response);
    });
}
// -------- REMOVE TRIP FROM DB -------- //

const removeTrip = (trip_id, user_id) => {

  fetch('/remove-trip', {
    method: 'POST',
    body: JSON.stringify({trip_id: trip_id, user_id: user_id}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(response => {
      document.querySelector(`#trip-${trip_id}`).remove();
      // alert(response);
    });
}

// add an event handler for deleting/removing trip
let results = document.querySelector('#get-trips');

results.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('delete')) {
    console.log(evt.target);
    if (confirm('Are you sure you want to delete this trip?')) {
      const trip_id = evt.target.getAttribute('trip-id');
      deleteTrip(trip_id);
    };
  } else if (evt.target.classList.contains('remove')) {
    if (confirm('Are you sure you want to remove this trip?')) {
      const trip_id = evt.target.getAttribute('trip-id');
      const user_id = document.querySelector('#user_id').value;
      console.log(trip_id)
      console.log(user_id)
      removeTrip(trip_id, user_id);
    };
  }
});