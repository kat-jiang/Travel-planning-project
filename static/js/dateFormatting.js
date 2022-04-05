"use strict";

const months = [ '01', '02', '03', '04','05', '06', '07', '08', '09', '10', '11', '12'];

const days = [ '01', '02', '03', '04','05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']

function formatDate(datestring) {
  const d = new Date(datestring);
  const year = d.getFullYear();
  const date = days[d.getDate()];
  const month = months[d.getMonth()];

  const formattedDate= `${month}-${date}-${year}`;

  return formattedDate
}

export {formatDate}