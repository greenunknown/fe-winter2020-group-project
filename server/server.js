'use strict';
const express = require('express');
const cors = require('cors');
const bent = require('bent');
const getJSON = bent('json', 200, 500);
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

// Get the user's steam id and if successful, their data and send it to the frontend.
async function getSteamId(usersteamname, response) {
    let obj = await getJSON('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+ key +'&vanityurl=' + usersteamname)
    console.log("obj", obj);
    if(obj.response.message !== "No match") {
        let usersteamid = obj.response.steamid;
        console.log("usersteamid:", usersteamid);

        // Get the player's profile summary information.
        let playerSum = await getJSON('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ key +'&steamids=' + usersteamid);
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

        // Get the player's recently played games
        let recentlyPlayed = await getJSON('http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key='+ key +'&steamid=' + usersteamid);
        console.log("recentlyPlayed:", recentlyPlayed);

        // Get the player's owned games     
        let ownedGames = await getJSON('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ key + '&steamid=' + usersteamid);
        console.log("ownedGames:", ownedGames);
            
        // Gonna comment this out for now.. so we don't keep getting 403 errors 
        // if(Object.entries(ownedGames.response).length !== 0) {        
  
        //     // Can only send 10 requests at a time.....
        //     var gameCount = ownedGames.response.game_count;
        //     var limit = gameCount < 9 ? gameCount : 9;
        //     var proms = [];
            
        //     var ids = [];
        //     for(var i =0; i < limit; i++){
        //             var id = ownedGames.response.games[i].appid;
        //             ids.push(id);
        //             var prom = getJSON('https://store.steampowered.com/api/appdetails?appids=' + id);
        //             proms.push(prom);
        //     }

        //     // S?ave promises and wait for all results at once instead of executing sequentially
        //     const allResults =  await Promise.all(proms);

        //     ids.forEach(i => {
        //         console.log(allResults[i].data);
        //     })
        // }


        // Get the list of all games on steam
        let gameslist = await getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2');
        console.log("gameslist:", gameslist);

        // Get player's wishlist
        let wishlist = await getJSON('https://store.steampowered.com/wishlist/profiles/' + usersteamid + '/wishlistdata/');
        console.log("wishlist", wishlist);

        // Get player's badges
        let badges = await getJSON('http://api.steampowered.com/IPlayerService/GetBadges/v1/?key=' + key + '&steamid=' + usersteamid);
        console.log("badges", badges);

        // console.log(ownedGames.response.games);
        
        // Package and send the data
        let data = [playerSum, friends, friendsSum, recentlyPlayed, ownedGames, gameslist, wishlist, badges];
        response.send(data);
    } else {
        // If there was no match for the given usersteamid, return 'No match' to the front end.
        let data = "No match";
        response.send(data);
    }
}

app.listen(port, () => console.log(`Listening on port ${port}`));