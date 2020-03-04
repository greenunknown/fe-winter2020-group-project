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

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let corsOptions = {};
app.use(cors());



app.post('/search', (req, res) => {
    let steamName = req.body.userId;
    
    getSteamId(steamName, res);
});

function putUserInFront(str, arr) {
    if(arr[0].steamid === str)
    {
        return arr;
    } else {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].steamid === str)
            {
                let temp = arr[i]; // User summary
                arr[i] = arr[0];
                arr[0] = temp;
                return arr;
            }
        }
    }
}
// Get the user's steam id and if successful, their data and send it to the frontend.
async function getSteamId(usersteamname, response) {
    let obj = await getJSON('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+ key +'&vanityurl=' + usersteamname)
    console.log("obj", obj);
    if(obj.response.message !== "No match") {
        let usersteamid = obj.response.steamid;
        console.log("usersteamid:", usersteamid);

        // Get the player's profile summary information.
        let playerSum = await getJSON('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + steamids);
        console.log("playerSum:", playerSum);

        // Get the player's friends list
        let friends = await getJSON('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+ key +'&steamid=' + usersteamid + "&relationship=friend");
        console.log("friends:", friends);
        
        // Get the player's friends' profile summary information. 
        let steamids = "";
        for(let i = 0; i < friends.friendslist.friends.length; i++)
        {
            if(i === 0)
            {
                steamids += friends.friendslist.friends[i].steamid;
            } else {
                steamids += "," + friends.friendslist.friends[i].steamid;
            }
        }
        console.log(steamids);

        let friendsSum = await getJSON('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + steamids);
        console.log("friendsSum:", friendsSum);

        let recentlyPlayed = await getJSON('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+ key +'&steamid=' + usersteamid);
        console.log("recentlyPlayed:", recentlyPlayed);

        let ownedGames = await getJSON('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ key + '&steamid=' + usersteamid);
        console.log("ownedGames:", ownedGames);

        let gameslist = await getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2');
        console.log("gameslist:", gameslist);

        let data = [playerSum, friends, friendsSum, recentlyPlayed, ownedGames, gameslist];
        response.send(data);
    } else {
        let data = "No match";
        response.send(data);
    }
}

app.listen(port, () => console.log(`Listening on port ${port}`));