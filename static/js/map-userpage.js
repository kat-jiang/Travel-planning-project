"use strict";


mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0amlhbmciLCJhIjoiY2wwdWh3NnRqMHhoODNrcW9yaXY5N2VnayJ9.HDKyR2oAhjjbkMOzSpI5-A';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-98.5795, 39.8283], // starting position [lng, lat]
  zoom: 2, // starting zoom
  hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
});

const userId = document.querySelector('#user_id').value;

fetch(`/api/trips?user_id=${userId}`)
  .then(response => response.json())
  .then(trips => {
    for (const trip of trips) {
      let longitude = trip.longitude;
      let latitude = trip.latitude;

      // add popup and marker to the map
      new mapboxgl.Marker()
      .setLngLat([`${longitude}`, `${latitude}`])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h5>${trip.trip_name}</h5><p>${trip.trip_location}</p>`
          )
      )
      .addTo(map);
    }
});
