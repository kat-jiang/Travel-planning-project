"use strict";

//-----------------Fetch from Yelp------------------
function display_search_cards(results) {
  for (const result of results) {
    const name = result.name;
    const rating = result.rating;
    const imageUrl = result.image_url;
    const displayPhone = result.display_phone;
    const address = result.location.display_address;

    const cardHtml = 
    `<div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4 d-flex aline-items-center">
          <img src="${imageUrl}" class="img-fluid rounded-start">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">
              ${name} (rating:${rating})
            </h5>
            <p class="card-text">
              ${address}
              <br>
              ${displayPhone}
            </p>
            <p class="card-text">
              <a href="" class="btn btn-primary">Add to itinerary</a>
            </p>
          </div>
        </div>
      </div>
    </div>`;
  
    document.querySelector('#display-results').insertAdjacentHTML('beforeend', cardHtml);
  }
};

function getActivitySearch(evt) {
  evt.preventDefault();

  const trip_id = document.querySelector('#trip_id').value;
  console.log(trip_id)
  fetch(`/api/activites?trip_id=${trip_id}`)
  .then(response => response.json())
  .then(activities => {
    console.log(activities)
    display_search_cards(activities)
  });
};

function getRestaurantSearch(evt) {
  evt.preventDefault();

  const trip_id = document.querySelector('#trip_id').value;
  console.log(trip_id)
  fetch(`/api/restaurants?trip_id=${trip_id}`)
  .then(response => response.json())
  .then(restaurants => {
    console.log(restaurants)
    display_search_cards(restaurants)
  });
};

document.querySelector('#activities').addEventListener('click', (evt) => {
  getActivitySearch(evt)
});

document.querySelector('#restaurants').addEventListener('click', (evt) => {
  getRestaurantSearch(evt)
});