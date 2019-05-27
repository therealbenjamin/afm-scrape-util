// Environment variables
require('dotenv').config();

// Calls / parsing
const axios = require('axios');
const cheerio = require('cheerio');

// Firebase shit
const firebase = require('firebase/app');
require('firebase/firestore');

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = firebase.firestore();

const url = `https://www.afmsagaftrafund.org/unclaimed-royalties.php?l=`;
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

alphabet.forEach(letter => {
  axios.get(`${url}${letter}`)
    .then(response => {
      getData(response.data);
    })
    .catch(error => {
      console.error(error);
    });
});

let getData = html => {
  const $ = cheerio.load(html);
  $('.grd-container').children().each((i, elem) => {
    const json = {
      name: $(elem).text().split(' --- ')[0],
      type: $(elem).text().split(' --- ')[1],
    };
    db.collection('content_owners')
      .where('name', '==', json.name)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().name === json.name) {
            console.log('Owner record already exists.');
          } else {
            db.collection('content_owners').add(json)
            .then(docRef => console.log(`Document written with ID ${docRef.id}`))
            .catch(error => console.log(`Error adding document: ${error}`));
          }
        });
      })
      .catch(error => console.log(error));
  });
};
