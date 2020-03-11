import React, { Component } from 'react';
// import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Bar, Scatter, Pie} from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import ClipLoader from "react-spinners/ClipLoader";
import { DivWithErrorHandling } from './ErrorMessageDiv';

import './style.css';

class App extends Component{
  // The state for the app contains data for a player. This data 
  state = {
    playerSummary: {
      steamid: "",
      personaname: "",
      profileurl: "#",
      avatar: "",
      avatarmedium: "",
      avatarfull: "",
      lastlogoff: 0,
      timecreated: 0
    },
    friendsSummary: [
      {
        steamid: "",
        personaname: "",
        profileurl: "#",
        avatar: "",
        avatarmedium: "",
        avatarfull: "",
        lastlogoff: 0,
        timecreated: 0
      }
    ],
    friendsList: [],
    recentlyPlayed: {
      total_count: 0,
      games: []
    },
    ownedGames: {
      game_count: 0,
      games: []
    },
    gamesList: [],
    wishlist: {},
    badges: {
      player_xp: 0,
      player_level: 0,
      player_xp_needed_to_level_up: 0.0000000001
    },
    landingPage: false,
    loading: false,
    matchFound: false,
    showError: false
  };

  shrinkSearchBar() {
    var searchDiv = document.getElementById("searchBarDiv");   
    var searchForm = document.getElementById("searchForm");
    var title = document.getElementById("titleHeader");
    var loadingDiv = document.getElementById("loadingDiv");

    // searchDiv.style.width= "30%";
    searchDiv.style.padding = "0px";
    searchDiv.style.margin = "0px";
    searchDiv.style.marginBottom = "50px";
    
    searchDiv.style.height= "10%";

    title.style.margin = "5px";
    title.style.fontSize = "20px";
    // title.style.margin = "30px";
    title.style.alignSelf = "flex-start";
    searchForm.style.width = "30%";
    searchForm.style.height = "10%";
    searchForm.style.alignSelf = "flex-start";
    // loadingDiv.style.alignSelf = "center";
  }

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {

    var response = '';
    
    var searchBar = document.getElementById("searchBar");

    if(searchBar.value !== ''){
      this.setState({loading: true});
    }

    try {
      response = await fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: this.state.userid }),
      });
    } catch(err) {
      this.setState({loading: false});
      return;
    }

      const data = await response.text();

      // If the username entered is valid, resolve the data received.
      //  Otherwise, setup the defaults for the page. This will make
      //  elements not render since their data is not useful until a
      //  valid user is entered.
      if(data !== "No match") 
      {
        if(!this.landingPage) {
          this.shrinkSearchBar();
        }

      this.setState({matchFound: true});
      this.setState({loading: false});
      this.setState({showError: false});
        
        
        
        var dataJSON = JSON.parse(data);
        console.log("Data:", dataJSON);
        // Set playerSummary data
        this.setState({playerSummary: dataJSON[0].response.players[0]})
        // Set player friendsLists
        this.setState({friendsList: dataJSON[1].friendslist.friends});
        // Set player's friendsSummary
        this.setState({friendsSummary: dataJSON[2].response.players})
        // Set player's recently played to the received data if there was
        //  a valid response.
        if (Object.keys(dataJSON[3].response).length === 0) {
          this.setState({recentlyPlayed: {total_count: 0, games: []}});
        } else {
          this.setState({recentlyPlayed: dataJSON[3].response});
        }
        // Set player's ownedgames to the received data if there was
        //  a valid response
        if (Object.keys(dataJSON[4].response).length === 0) {
          this.setState({ownedGames: {game_count: 0, games: []}});
        } else {
          this.setState({ownedGames: dataJSON[4].response});
        }
        // Set the gamesList
        this.setState({gamesList: dataJSON[5].applist.apps});
        // Set the player's wishlist if the data recieved was valid
        if(dataJSON[6].success === 2)
        {
          this.setState({wishlist: {}});
        } else {
          this.setState({wishlist: dataJSON[6]});
        }
        // Set player's badges
        this.setState({badges: dataJSON[7].response});
      } else {
      
      this.setState({loading: false});
      this.setState({matchFound: false});
      this.setState( {showError: true});
   
      console.log("No match found!");
      return;
//       this.setState({playerSummary: [
//         {
//           steamid: "",
//           personaname: "",
//           profileurl: "#",
//           avatar: "",
//           avatarmedium: "",
//           avatarfull: "",
//           lastlogoff: 0,
//           timecreated: 0
//         }
//       ]});
//       this.setState({friendsList: []});
//       this.setState({friendsSummary: [
//         {
//           steamid: "",
//           personaname: "",
//           profileurl: "#",
//           avatar: "",
//           avatarmedium: "",
//           avatarfull: "",
//           lastlogoff: 0,
//           timecreated: 0
//         }
//       ]});
//       this.setState({recentlyPlayed: {total_count: 0, games: []}});
//       this.setState({ownedGames: {game_count: 0, games: []}});
//       this.setState({gamesList: []});
//       this.setState({wishlist: {}});
//       this.setState({badges: []});

//       this.setState({badges: {
//         player_xp: 0,
//         player_level: 0,
//         player_xp_needed_to_level_up: 0.0000000001
//       }});
    }    

      console.log("playerSummary", this.state.playerSummary);
      console.log("friendsList", this.state.friendsList);
      console.log("friendsSummary", this.state.friendsSummary);
      console.log("recentlyPlayed", this.state.recentlyPlayed);
      console.log("ownedGames", this.state.ownedGames);
      console.log("wishlist:", this.state.wishlist);
      console.log("badges:", this.state.badges);
      // console.log(this.state.gamesList);
  };

  handleSubmit(event) {
    event.preventDefault();
  };

  render() {
    const {friendsList, recentlyPlayed, playerSummary, friendsSummary, wishlist, badges, ownedGames, gamesList} = this.state;

    // Time converter function by shomrat from: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    // Retrieved on 3-2-20
    function timeConverter(UNIX_timestamp){
      if(UNIX_timestamp === 0) {
        return '';
      } else if (typeof UNIX_timestamp === 'undefined') {
        return "Long, long time ago";
      }
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }

    // Description: Render the user's profile
    // Props: playerSummary, badges
    function UserProfile(props) {
      const playerSummary = props.playerSummary;
      const badges = props.badges;

      // User doesn't exist so cannot get their summary
      if(Object.keys(playerSummary).length === 0)
      {
        return(null);
      }

      // If user isn't the default user, render their profile
      if(playerSummary.steamid !== ""){
        return(
          <Card>
            <Card.Img variant="top" src={playerSummary.avatarfull} />
            <Card.Body>
              <Card.Title>{playerSummary.personaname}</Card.Title>
              <Card.Link href={playerSummary.profileurl} target="_blank">Steam Profile</Card.Link>
              <Card.Text>
                <UserPersonaState personastate={playerSummary.personastate}/>
                Last Log Off: {timeConverter(playerSummary.lastlogoff)}
                <br></br>
                Profile Created: {timeConverter(playerSummary.timecreated)}
                <br></br>
                Player Level: {badges.player_level}
                <br></br>
                Exp Progress:     
                       
              </Card.Text>
              <ProgressBar now={(badges.player_xp / (badges.player_xp + badges.player_xp_needed_to_level_up))*100} 
                  label={badges.player_xp_needed_to_level_up + "\tneeded to level up"}/>   
            </Card.Body>
          </Card>
        )
      } else {
        return(null);
      }
    }

    // Description: Render the user's friends' summaries
    // Props: friendsSummary
    function FriendSummary(props) {
      const friendsSummary = props.friendsSummary;

      // User doesn't exist so cannot get friends summaries
      if(friendsSummary.length === 0)
      {
        return(null);
      }

      // User has friends to get summaries from, 
      // otherwise return nothing
      if(friendsSummary[0].steamid !== "")
      {
        return(
          <Accordion defaultActiveKey="1">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  Friends
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body style={{overflow: 'auto', height: '500px'}}>
                  {friendsSummary.map((friend, i) => {
                    return (
                      <React.Fragment key={i}>
                        <div style={{border: "5px solid #007bff", "borderRadius": "12px"}}>
                          <Image alt="friend profile" src={friend.avatarfull}/>
                          <br></br>
                          <a href={friend.profileurl} target="_blank" rel="noopener noreferrer">{friend.personaname}</a>
                          <UserPersonaState personastate={friend.personastate}/>
                        </div>
                        <br></br>
                      </React.Fragment>
                    )
                    })}
                  </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )
      } else {
        return(null);
      }
    }

    // Description: Render a game given the game and appid
    // Props: game, appid
    function WishlistGame(props) {
      const game = props.game;
      const appid = props.appid;
      if(game.subs.length > 0)
      {
        return(
          <React.Fragment>
            <ListGroup.Item as="li">
              <Image src={game.capsule} />
              <a href={"https://store.steampowered.com/app/" + appid} target="_blank" rel="noopener noreferrer">{game.name}</a>
              <br></br>
              ${game.subs[0].price / 100}
            </ListGroup.Item>
          </React.Fragment>
        )
      } else {
        return(null);
      }
    }

    // Description: Render the player's wishlist
    // Props: wishlist
    function Wishlist(props) {
      const wishlist = props.wishlist;
      
      // Create the player's wishlist if possible
      if(Object.keys(wishlist).length === 0)
      {
        return(null);
      } else {
        let wishlist_games = [];
        let wishlist_appids = [];
        for(const [key, value] of Object.entries(wishlist)) {
          wishlist_games.push(value);
          wishlist_appids.push(key);
        }
  
        return (
          <React.Fragment>
            <AccordionComponent header="Wishlist" body={
              <ListGroup as="ul" style={{overflow: 'auto', height: '500px'}} variant="flush">
              {
                  wishlist_games.map((game, i) => {
                    return(
                      <WishlistGame game={game} appid={wishlist_appids[i]} key={i}/>
                    )
                  })
              }
              </ListGroup>
            }/>
          </React.Fragment>
        )
      }
    }

    // Description: Render a card to show a player's current status
    // Props: personastate
    function UserPersonaState(props) {
      const personastate = props.personastate;
      if(personastate === 0) {
        return(
          <Card bg='light' text='dark'>
            <Card.Header>Offline</Card.Header>
          </Card>
        );
      } else if(personastate === 1) {
        return(
          <Card bg='success' text='white'>
          <Card.Header>Online</Card.Header>
        </Card>
        )
      } else if(personastate === 2) {
        return(
          <Card bg='danger' text='white'>
            <Card.Header>Busy</Card.Header>
          </Card>
        )
      } else if(personastate === 3) {
        return(
          <Card bg='warning' text='white'>
            <Card.Header>Away</Card.Header>
          </Card>
        )
      } else if(personastate === 4) {
        return(
          <Card bg='secondary' text='white'>
            <Card.Header>Snooze</Card.Header>
          </Card>
        )
      } else if(personastate === 5) {
        return(
          <Card bg='info' text='white'>
            <Card.Header>Looking to trade</Card.Header>
          </Card>
        )
      } else if(personastate === 6) {
        return(
          <Card bg='primary' text='white'>
            <Card.Header>Looking to play</Card.Header>
          </Card>
        )
      } else {
        return ( 
          null
        )
      }
    }

    // Description: Render a list of the player's recently played games
    // Props: recentlyPlayed
    function RecentlyPlayed(props) {
      const recentlyPlayed = props.recentlyPlayed;

      if(recentlyPlayed.total_count > 0)
      {
        return(
          <React.Fragment>
            <h2>Recently Played</h2>
            {recentlyPlayed.games.map((game, i) => {
              return (
                <div key={i}>
                  <Card >
                    <Card.Img variant="top" src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"} />
                    <Card.Body>
                      <Card.Title>{game.name}</Card.Title>
                      <Card.Link href={"https://store.steampowered.com/app/" + game.appid + "/"} target="_blank">Steam Store Page</Card.Link>
                    </Card.Body>
                  </Card>
                </div>
              )
            })}
          </React.Fragment>
        );
      } else {
        return(null);
      }
    }

    // Description: Render the player's recently played games in the last two weeks
    // Props:  games
    function RecentlyPlayedBar(props) {
      let games = props.games;
      let ls = games.map(game => game.name);
      let d = games.map((game) => game.playtime_2weeks);

      return(
        <Bar
          data={
            {
              labels: ls,
              datasets: [
                {
                  label: "Playtime (Minutes)",
                  backgroundColor: ["#007bff", 
                  "#ff3648", 
                  "#ffbb34",
                  "#01c851",
                  "#33b5e7",
                  "#2abbac",
                  "#4385f5",
                  "#aa66cd",
                  "#34383e",
                  "#69727b"
                  ],
                  data: d
                }
              ]
            }
          }
          options={{
            title:{
              display:true,
              text:'Recently Played Games',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      )
    }

    // Description: Render bar chart for top 10 most played games user owns
    // Props: games, gameslist
    function TopTenOwnedGamesBar(props) {
      const games = props.games;
      const gameslist = props.gameslist;

      // Sort games array in descending order, grab the top 10, and return an array of the appids
      const ls = games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).slice(0, 10).map(game => game.appid);
      // Sort games array in descending order, grab the top 10, and return an array of the playtime since they first played
      const d = games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).slice(0, 10).map((game) => game.playtime_forever);
      // Loop through and create an array of matching game_names for each appid
      const game_names = new Array(10);
      for(let i = 0; i < gameslist.length; i++)
      {
        for(let j = 0; j < ls.length; j++)
        {
          if(gameslist[i].appid === ls[j])
          {
            game_names[j] = gameslist[i].name;
          }
        }
      }
      return(
        <Bar
          data={
            {
              labels: game_names,
              datasets: [
                {
                  label: "Playtime (Minutes)",
                  backgroundColor: ["#007bff", 
                  "#ff3648", 
                  "#ffbb34",
                  "#01c851",
                  "#33b5e7",
                  "#2abbac",
                  "#4385f5",
                  "#aa66cd",
                  "#34383e",
                  "#69727b"
                  ],
                  data: d
                }
              ]
            }
          }
          options={{
            title:{
              display:true,
              text:'Top 10 Owned Games Playtime',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      )
    }

    // Description: Conditionally render user's recentlyPlayed and ownedGame 
    //  playtime in charts.
    // Props: playerSummary, recentlyPlayed, ownedGames, gamesList
    function SteamStatistics(props) {
      const playerSummary = props.playerSummary;
      const recentlyPlayed = props.recentlyPlayed;
      const ownedGames = props.ownedGames;
      const gamesList = props.gamesList;

      // If the user exists, render their charts
      if(playerSummary.steamid !== "" && ownedGames.game_count > 0)
      {
        return(
          <AccordionComponent header="Steam Statistics" body={
            <React.Fragment>
              <RecentlyPlayedBar games={recentlyPlayed.games}/>
              <TopTenOwnedGamesBar games={ownedGames.games} gameslist={gamesList}/>
            </React.Fragment>
          }/>
        );
      } else {
        return(null);
      }
    }

    // Description: A component to make accordion elements easier to use.
    // Props: header, body
    function AccordionComponent(props) {
      const header = props.header;
      const body = props.body;
      return (
        <React.Fragment>
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  {header}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  {body}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </React.Fragment>
      )
    }


     return (
        <Container id="container">
          <DivWithErrorHandling showError={this.state.showError}>
            <div className = "searchBarDiv" id="searchBarDiv">
          
              <h1 className="titleHeader" id="titleHeader">Steam Dash</h1>            
                <Form id="searchForm" onSubmit={this.handleSubmit}>
                    <InputGroup className="mb-1">
                      <FormControl className="searchBar" id="searchBar" placeholder="Steam Username" aria-label="Steam Username" onChange={e => this.setState({ userid: e.target.value })}/>
                      <InputGroup.Append>
                        <Button className="searchButton" type="Submit" value="Submit" variant="light" onClick={this.callBackendAPI} readOnly><FontAwesomeIcon icon={faSearch} color="black" /></Button>
                      </InputGroup.Append>
                      <ClipLoader size={50} color={"#555555"} loading={this.state.loading}/>
                    </InputGroup>
                </Form>
            </div>
          </DivWithErrorHandling>            
          <Row>
            <Col md lg="4">
              {/* Display player summary */}
              <UserProfile playerSummary={playerSummary} badges={badges}/>
            </Col>

            <Col md lg="3">
              {/* Display friends summaries */}
              <FriendSummary friendsSummary={friendsSummary}/>
            </Col>
            <Col md lg="5">
              {/* Display wishlist */}
              <Wishlist wishlist={wishlist} />
            </Col>
          </Row>
          <Row>
            <Col md lg="4">
              {/* Display recently played Games*/}
              <RecentlyPlayed recentlyPlayed={recentlyPlayed}/>
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Display the charts for recently played and top ten played owned games */}
              <SteamStatistics playerSummary={playerSummary} recentlyPlayed={recentlyPlayed}
                ownedGames={ownedGames} gamesList={gamesList}/>
            </Col>
          </Row>
        </Container>
    );
  }
}

export default App;
