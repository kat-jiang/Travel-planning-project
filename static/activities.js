"use strict";

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
    });
};


// add an event handler to handle clicking on add
for (const button of document.querySelectorAll('.add-to-itinerary')) {
  button.addEventListener('click', (evt) => {
    addToItinerary(evt)
  })
};

mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0amlhbmciLCJhIjoiY2wwdWh3NnRqMHhoODNrcW9yaXY5N2VnayJ9.HDKyR2oAhjjbkMOzSpI5-A';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-98.5795, 39.8283], // starting position [lng, lat]
  zoom: 4, // starting zoom
  hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
});
