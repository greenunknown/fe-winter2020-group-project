'use strict';
const express = require('express')
const cors = require('cors')
const request = require('request');
const app = express()
const port = process.env.PORT || 5000
// const steamconfig = require('./steamconfig.js')
// let key = steamconfig.apiKey;
const fs = require('fs');
let rawdata = fs.readFileSync('steamconfig.json')
let key = JSON.parse(rawdata).apiKey
// console.log(key)

app.use(cors())

app.get('/games', (req, res) =>{
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });

    request('http://api.steampowered.com/ISteamApps/GetAppList/v2', {json: true}, (err, response, body) => {
        if(err) {return console.log(err);}
        console.log(body);
        res.send({express: body})
        // res.send({express: JSON.stringify(body)})
    });
});

app.get('/', (req, res) => {
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });

    request('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+ key +'&vanityurl=dsongpdx', {json: true}, (err, response, body) => {
        if(err) {return console.log(err);}
        console.log(body);
        res.send(body)
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));