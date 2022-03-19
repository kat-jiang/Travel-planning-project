"use strict";

const addToItinerary = (evt) => {
  evt.preventDefault();
  
  // const yelp_id = evt.target.value;
  // console.log(activity)
  // console.log(activity.name)
  const formInputs = {
    // activity_name: activity.name,
    // activity_type: activity.categories,
    // address:activity.display_address,
    // phone: activity.display_phone,
    // longitude: activity.coordinates,
    // latitude: activity.coordinates,
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
}