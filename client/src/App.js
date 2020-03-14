import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import ClipLoader from "react-spinners/ClipLoader";
import { DivWithErrorHandling } from './ErrorMessageDiv';
import { UserProfile, FriendSummary, Wishlist, RecentlyPlayed,  SteamStatistics, }  from './Components'

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
    title.style.fontWeight = "bolder";
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
      response = await fetch('/search', {
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
                      <ClipLoader size={50} color={"#ecf0f1"} loading={this.state.loading}/>
                    </InputGroup>
                </Form>
            </div>
          </DivWithErrorHandling>            
          <Row className="middleDiv">
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
            <Col md lg="12">
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