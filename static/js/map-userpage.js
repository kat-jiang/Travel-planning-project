"use strict";
import {config} from "./config.js"

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
