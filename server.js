'use strict';
const express = require('express')
const cors = require('cors')
const request = require('request');
const bent = require('bent');
const getJSON = bent('json');
const app = express()
const port = process.env.PORT || 5000
const fs = require('fs');
let rawdata = fs.readFileSync('steamconfig.json')
let key = JSON.parse(rawdata).apiKey

app.use(cors())

// app.get('/games', (req, res) =>{
//     res.status(200);
//     res.set({
//         'Content-Type': 'text/html'
//     });

//     request('http://api.steampowered.com/ISteamApps/GetAppList/v2', {json: true}, (err, response, body) => {
//         if(err) {return console.log(err);}
//         console.log(body);
//         res.send({express: body})
//         // res.send({express: JSON.stringify(body)})
//     });
// });

app.get('/search', (req, res) => {
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });

    let usersteamname = "redunknown1"; //"dsongpdx";


    let getSteamId = async () => {
        let obj = await getJSON('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+ key +'&vanityurl=' + usersteamname);
        console.log("obj", obj);
        let usersteamid = obj.response.steamid;
        console.log("usersteamid:", usersteamid);

        let playerSum = await getJSON('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + usersteamid);
        console.log("playerSum:", playerSum);

        let friends = await getJSON('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+ key +'&steamid=' + usersteamid + "&relationship=friend");
        console.log("friends:", friends);
        let recentlyPlayed = await getJSON('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+ key +'&steamid=' + usersteamid);
        console.log("recentlyPlayed:", recentlyPlayed);

        let ownedGames = await getJSON('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ key + '&steamid=' + usersteamid);
        console.log("ownedGames:", ownedGames);

        let gameslist = await getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2');
        console.log("gameslist:", gameslist);

        // res.write(usersteamid);
        // res.write(JSON.stringify(playerSum));
        // res.write(JSON.stringify(friends));
        // res.write(JSON.stringify(recentlyPlayed));
        // res.write(JSON.stringify(ownedGames));
        // res.write(JSON.stringify(gameslist));
        let data = [playerSum, friends, recentlyPlayed, ownedGames, gameslist];
        res.write(JSON.stringify(data));
        res.end();

    }
    getSteamId();



    // request('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+ key +'&vanityurl=' + usersteamname, {json: true}, (err, response, mainbody) => {
    //     if(err) {return console.log(err);}
    //     console.log("Body:", mainbody);
    //     let usersteamid = mainbody.response.steamid;
    //     console.log("Inside Usersteamid: ", usersteamid);
    //     res.send(mainbody)
    //     // request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + usersteamid, {json: true}, (err, response, body) => {
    //     //     if(err) {return console.log(err)}
    //     //     console.log(body);
    //     //     res.send(body)
    //     // });
    //     // request('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+ key +'&steamid=' + usersteamid + "&relationship=friend", {json: true}, (err, response, body) => {
    //     // if(err) {return console.log(err);}
    //     // console.log(body);
    //     // res.send(body)
    //     // });
    //     // return body.steamid;
    // });
    // console.log("After Usersteamid: ", usersteamid);
    // console.log(useridreq);
    // let usersteamid = 76561198096334039;
    // request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + usersteamid, {json: true}, (err, response, body) => {
    //     if(err) {return console.log(err);}
    //     console.log(body);
    //     res.send(body)
    // });
});

app.get('/playersummaries', (req, res) => {
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });

    let usersteamid = 76561198096334039;
    request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + usersteamid, {json: true}, (err, response, body) => {
        if(err) {return console.log(err);}
        console.log(body);
        res.send(body)
    });
});

app.get('/friendslist', (req, res) => {
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });

    let usersteamid = 76561198096334039;
    request('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+ key +'&steamid=' + usersteamid + "&relationship=friend", {json: true}, (err, response, body) => {
        if(err) {return console.log(err);}
        console.log(body);
        res.send(body)
    });
});

app.get('/recentplayedgames', (req, res) => {
    res.status(200);
    res.set({
        'Content-Type': 'text/html'
    });

    let usersteamid = 76561198096334039;
    request('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+ key +'&steamid=' + usersteamid, {json: true}, (err, response, body) => {
        if(err) {return console.log(err);}
        console.log(body);
        res.send(body)
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));