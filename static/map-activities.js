"use strict";



// const userId = document.querySelector('#user_id').value;

// fetch(`/api/trips?user_id=${userId}`)
//   .then(response => response.json())
//   .then(trips => {
//     for (const trip of trips) {
//       let longitude = trip.longitude;
//       let latitude = trip.latitude;

//       // Create a default Marker and add it to the map.
//       const marker = new mapboxgl.Marker()
//       .setLngLat([`${longitude}`, `${latitude}`])
//       .setPopup(
//         new mapboxgl.Popup({ offset: 25 }) // add popups
//           .setHTML(
//             `<h5>${trip.trip_name}</h5><p>${trip.trip_location}</p>`
//           )
//       )
//       .addTo(map);
//     }
// });
