
const addTrip = (evt) => {
  evt.preventDefault();

  const formInputs = {
    location: document.querySelector('#location').value,
    name: document.querySelector('#trip-name').value,
    start: document.querySelector('#start-date').value,
    end: document.querySelector('#end-date').value,
  };

  const url = `/user_page/${user_id}/add-trip.json`;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(userTrip => {
      document.querySelector('#get-trips').insertAdjacentHTML('beforeend', `<div><p>${userTrip.trip_name}, ${userTrip.trip_location}, ${userTrip.start_date}, ${userTrip.end_date}</p></div>`);
  })
}

document.querySelector('#add-trip').addEventListener('submit', (evt) => {
  addTrip(evt)
})