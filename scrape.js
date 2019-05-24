// Calls / parsing
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = `https://www.afmsagaftrafund.org/unclaimed-royalties.php?l=`;
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

alphabet.forEach(letter => {
  axios.get(`${url}${letter}`)
    .then(response => {
      getData(response.data);
    })
    .catch(err => {
      console.error(err);
    });
});

let getData = html => {
  const owners = [];
  const $ = cheerio.load(html);
  $('.grd-container').children().each((i, elem) => {
    const json = {
      name: $(elem).text().split('---')[0],
      type: $(elem).text().split('---')[1],
    };
    owners.push(JSON.stringify(json));
  });
  
};
