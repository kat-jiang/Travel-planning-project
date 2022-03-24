"use strict";

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
      console.log(response);
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