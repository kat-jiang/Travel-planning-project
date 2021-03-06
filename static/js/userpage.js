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
        new mapboxgl.Marker({color:"#81b29a"})
        .setLngLat([`${tripLng}`, `${tripLat}`])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h5><strong>${trip.trip_name}</strong></h5><p>${trip.trip_location}</p>`
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

  // -------- SWIPER INITIALIZATION-------- //

  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    allowTouchMove: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    },
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
    new mapboxgl.Marker({color:"#81b29a"})
    .setLngLat([`${userTrip.longitude}`, `${userTrip.latitude}`])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h5><strong>${userTrip.trip_name}</strong></h5><p>${userTrip.trip_location}</p>`
        )
    )
    .addTo(map);

    const startdateObject = formatDate(userTrip.start_date)
    const enddateObject = formatDate(userTrip.end_date)

    // document.querySelector('.swiper-wrapper').insertAdjacentHTML('beforeend',
    swiper.prependSlide(
    `
    <div class="swiper-slide" style="width: 318.667px; margin-right: 30px;">
      <div class="card trip-card" id="trip-${userTrip.trip_id}">
        <a href="/trip/${userTrip.trip_id}" class="trip-info">
          <img src="${userTrip.trip_image}" class="card-img-top">
          <div class="card-body">
            <div class="card-text">
              <h3 class="trip-name">${userTrip.trip_name}</h3>
              ${userTrip.trip_location}<br>
              ${startdateObject} to ${enddateObject}
            </div>
          </div>
        </a>
        <button class="btn btn-secondary btn-delete delete" trip-id="${userTrip.trip_id}">Delete Trip</button>
      </div>
    </div>
    `
    );
    swiper.slideTo(0);
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
      const slides = document.querySelectorAll(".swiper .swiper-slide")
      for (let i=0; i < slides.length; i++) {
        if (slides[i].firstElementChild.id == `trip-${trip_id}`) {
          swiper.removeSlide(i);
        }
      }
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
    if (confirm('Are you sure you want to delete this trip?')) {
      const trip_id = evt.target.getAttribute('trip-id');
      deleteTrip(trip_id);
    };
  } else if (evt.target.classList.contains('remove')) {
    if (confirm('Are you sure you want to remove this trip?')) {
      const trip_id = evt.target.getAttribute('trip-id');
      const user_id = document.querySelector('#user_id').value;
      removeTrip(trip_id, user_id);
    };
  }
});