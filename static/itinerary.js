"use strict";
let activityId = null
for (const button of document.querySelectorAll(".modal-btn")) {
  button.addEventListener('click', () => {
    activityId = button.getAttribute('id')
  })
};

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


const addDatetime = (evt, activityId) => {
  evt.preventDefault();

  const formInputs = {
    activity_id: activityId,
    datetime: document.querySelector('#activity-time').value,
  };

  fetch('/add-datetime', {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(response => {
      alert(response);
      location.reload()
    });
};

document.querySelector('#add-datetime').addEventListener('submit', (evt) => {
  addDatetime(evt, activityId);
})
