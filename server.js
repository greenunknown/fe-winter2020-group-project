'use strict';

const steamconfig = require('./steamconfig.js')
let key = steamconfig.apiKey;
// console.log(key);


const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const https = require('https');
const request = require('request');


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


app.get('/missing', (req, res) => {
    res.status(404);
    res.set({
        'Content-Type': 'text/plain'
    });
    res.write('Your princess is in another castle');
    res.end();
})

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// app.get('https://ghibliapi.herokuapp.com/people/', (req, res) => {
//     res.set({
//         'Content-Type': 'application/json'
//     });
//     res.write('"you have accessed"' + req.params);
//     res.end();
// });

// request('https://ghibliapi.herokuapp.com/people/', {json: true}, (err, res, body) => {
//     if(err) {return console.log(err);}
//     console.log(body);
//     res.write(body)
//     console.log(body.explanation);
// })

// https.get('https://ghibliapi.herokuapp.com/people/', (res) => {
//     let data = "";
//     res.on('data', (chunk) => {
//         data += chunk;
//     })

//     res.on('end', () => {
//         console.log(JSON.parse(data));
//     });

//     res.write(data);
//     res.end();
// }).on("error", (err) => {
//     console.log("Error: " + err.message);
// });

// const options = {
//     hostname: 'ghibliapi.herokuapp.com',
//     // port: '8080',
//     path: '/people',
//     method: 'GET'
// }

// const req = https.request(options, (res) => {
//     console.log('Status code: ', res.statusCode);
//     console.log('headers: ', res.headers);

//     res.on('data', (d) => {
//         // process.stdout.write(d);
//         res.write(d);
//     });
// });

// req.on('error', (e) => {
//     console.error(e);
// });

// req.end();

app.get('/', (req, res) => {
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });
    // res.write('<!DOCTYPE html><html><body>');

    let temp = "";
    request('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+ key +'&vanityurl=dsongpdx', {json: true}, (err, res, body) => {
        if(err) {return console.log(err);}
        console.log(body);
        temp = body;
    });
    console.log("temp");
    res.write(temp);
    // res.write('</body></html>');
    res.end();
});