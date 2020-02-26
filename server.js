'use strict';
const express = require('express');
const cors = require('cors');
const bent = require('bent');
const getJSON = bent('json');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');
let rawdata = fs.readFileSync('steamconfig.json');
let key = JSON.parse(rawdata).apiKey;

let corsOptions = {};
app.use(cors());

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
});

app.listen(port, () => console.log(`Listening on port ${port}`));