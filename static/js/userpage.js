"use strict";

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
      document.querySelector('#get-trips').insertAdjacentHTML('beforeend', 
      `
      <div class="card col-md-3" id="trip-${userTrip.trip_id}" style="width: 18rem;">
        <a href="/trip/${userTrip.trip_id}">
          <div class="card-body">
            <p class="card-text">
              <h3>${userTrip.trip_name}</h3>
              <h4>${userTrip.trip_location}</h4>
              ${userTrip.start_date} to ${userTrip.end_date}
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
      alert(response);
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
      alert(response);
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