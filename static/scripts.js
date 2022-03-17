"use strict";

// -----------------Add trip------------------
const addTrip = (evt) => {
  evt.preventDefault();

  const formInputs = {
    location: document.querySelector('#location').value,
    name: document.querySelector('#trip-name').value,
    start: document.querySelector('#start-date').value,
    end: document.querySelector('#end-date').value,
    user_id: document.querySelector('#user_id').value,
  };

  const url = '/add-trip.json';

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(userTrip => {
      document.querySelector('#get-trips').insertAdjacentHTML('beforeend', 
      `<div class="card" style="width: 18rem;">
      <div class="card-body">
        <p class="card-text">
          <h3>${userTrip.trip_name}</h3>
          <h4>${userTrip.trip_location}</h4>
          ${userTrip.start_date} to ${userTrip.end_date}
        </p>
      </div>
      </div>`);
  })
}

// add an event handler to handle submitting the form
document.querySelector('#add-trip').addEventListener('submit', (evt) => {
  addTrip(evt)
});

// ------------------Delete trip-----------------
const deleteTrip = (evt) => {
  const trip_id = evt.target.getAttribute('trip-id')
  console.log(trip_id)
  console.log(typeof(trip_id))
  
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
      alert(response);
    });
}

// add an event handler to handle clicking on a delete button
for (const button of document.querySelectorAll('#delete')) {
  button.addEventListener('click', (evt) => {
    deleteTrip(evt)
  })
}
  
