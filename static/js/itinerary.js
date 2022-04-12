"use strict";
import {config} from "./config.js"


// -------- DISPLAY MAP FROM MAPBOX -------- //
const tripLat = document.querySelector('#trip-lat').value;
const tripLng = document.querySelector('#trip-lng').value;

mapboxgl.accessToken = config.mapboxApiKey;

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [ `${tripLng}` , `${tripLat}` ], // starting position [lng, lat]
    zoom: 9, // starting zoom
    hash: true, // sync `center`, `zoom`, `pitch`, and `bearing` with URL
  });

  // fetch all activity lng/lats to display
  const tripId = document.querySelector('#trip_id').value;
  fetch(`/api/itinerary-activities?trip_id=${tripId}`)
    .then(response => response.json())
    .then(data => {
      const unsortedActivities = data.unsorted_activities;
      const sortedActivities = data.sorted_activities;

      // make markers for unsorted activities
      for (const unsortedActivity of unsortedActivities) {
        let uactivityLng = unsortedActivity.longitude;
        let uactivityLat = unsortedActivity.latitude;

        // create popup for the activity
        const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h5>${unsortedActivity.activity_name}</h5>
          <p>${unsortedActivity.activity_type}<br>${unsortedActivity.address}</p>`
        )
        // create marker and add to map
        const marker = new mapboxgl.Marker({color: '#A0A0A0'})
        .setLngLat([`${uactivityLng}`, `${uactivityLat}`])
        .setPopup(popup)
        .addTo(map)
      }

      // make markers for sorted activities
      for (const [index, [date, activity_list]] of Object.entries(Object.entries(sortedActivities))) {
        for (const activity of activity_list) {
          let activityLng = activity.longitude;
          let activityLat = activity.latitude;

          // create popup for the activity
          const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h5>${activity.activity_name}</h5>
            <p>${activity.activity_type}<br>${activity.address}</p>`
          )
          // create marker and add to map
          const marker = new mapboxgl.Marker({color: '#81b29a'})
          .setLngLat([`${activityLng}`, `${activityLat}`])
          .setPopup(popup)
          .addTo(map)
          const markerEl = marker.getElement()
          const numWrap = document.createElement('div');
          numWrap.classList.add('marker-number')
          numWrap.innerHTML = `${parseInt(index)+1}`
          markerEl.append(numWrap)
        }
      }
  });

// -------- ADD DATETIME TO ACTIVITY -------- //

// event listener to add/edit buttons to toggle modal, grab activity id
let activityId = null
for (const button of document.querySelectorAll(".modal-btn")) {
  button.addEventListener('click', () => {
    activityId = button.getAttribute('data-activity-id')
  })
};

// callback function to update db with datetime
const addDatetime = (evt, activityId) => {
  evt.preventDefault();

  const formInputs = {
    activity_id: activityId,
    datetime: document.querySelector('#activity-time').value,
    note: document.querySelector('#activity-note').value,
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
      // alert(response);
      location.reload()
    });
};

document.querySelector('#add-datetime').addEventListener('submit', (evt) => {
  addDatetime(evt, activityId);
})

// -------- ADD OWN ACTIVITY -------- //

document.querySelector('#add-activity').addEventListener('click', (evt) => {
  const tripId = document.querySelector('#trip_id').value
  addOwnActivity(tripId);
});

const addOwnActivity = (tripId) => {

  const formInputs = {
    trip_id: tripId,
    activity_name: document.querySelector('#own-activity-name').value,
    activity_type: document.querySelector('#own-activity-type').value,
    address: document.querySelector('#own-activity-address').value,
    phone: document.querySelector('#own-activity-phone').value,
    datetime: document.querySelector('#own-activity-time').value,
    note: document.querySelector('#own-activity-note').value,
  };

  fetch('/add-own-activity', {
    method: 'POST',
    body: JSON.stringify(formInputs),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(response => {
      // alert(response);
      location.reload()
    });
};

// -------- REMOVE ACTIVITY -------- //

const removeActivity = (activityId) => {

  fetch('/delete-activity', {
    method: 'POST',
    body: JSON.stringify({activity_id: activityId}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(response => {
      // console.log(response);
      location.reload()
    });
};

for (const button of document.querySelectorAll(".remove")) {
  button.addEventListener('click', () => {
    activityId = button.getAttribute('data-activity-id');
    console.log(activityId)
    if (confirm('Do you want to remove this activity?')) {
      removeActivity(activityId);
    }
  })
};