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
import {Bar, Scatter, Linke, Pie} from 'react-chartjs-2';
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
    badges: [],
    labels: ['January', 'February', 'March',
    'April', 'May'],
    datasets: [
      {
        label: "Playtime",
        backgroundColor: "rgba(0,123,255,1)",
        data: [65, 59, 80, 81, 56]
      }
    ],
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

    if(data !== "No match") 
    {
      if(!this.landingPage) {
        this.shrinkSearchBar();
      }

      this.setState({matchFound: true});
      this.setState({showError: false});
      
      var dataJSON = JSON.parse(data);
      this.setState({playerSummary: dataJSON[0].response.players[0]})
      this.setState({friendsList: dataJSON[1].friendslist.friends});
      this.setState({friendsSummary: dataJSON[2].response.players})
      // this.setState({recentlyPlayed: dataJSON[3].response});
      if (Object.keys(dataJSON[3].response).length === 0) {
        this.setState({recentlyPlayed: {total_count: 0, games: []}});
      } else {
        this.setState({recentlyPlayed: dataJSON[3].response});
      }
      // this.setState({ownedGames: dataJSON[4].response});
      if (Object.keys(dataJSON[4].response).length === 0) {
        this.setState({recentlyPlayed: {game_count: 0, games: []}});
      } else {
        this.setState({ownedGames: dataJSON[4].response});
      }
      this.setState({gamesList: dataJSON[5].applist.apps});
      if(dataJSON[6] === {success: 2})
      {
        this.setState({wishlist: {}});
      } else {
        this.setState({wishlist: dataJSON[6]});
      }
      this.setState({badges: dataJSON[7].response});

      var mainDiv = document.getElementById("mainDiv");
      mainDiv.style.display = "block";
    } else {
      
      this.setState({loading: false});
      this.setState({matchFound: false});
      this.setState( {showError: true});
    
      console.log("No match found!");
      return;
      // this.setState({playerSummary: [
      //   {
      //     steamid: "",
      //     personaname: "",
      //     profileurl: "#",
      //     avatar: "",
      //     avatarmedium: "",
      //     avatarfull: "",
      //     lastlogoff: 0,
      //     timecreated: 0
      //   }
      // ]});
      // this.setState({friendsList: []});
      // this.setState({friendsSummary: [
      //   {
      //     steamid: "",
      //     personaname: "",
      //     profileurl: "#",
      //     avatar: "",
      //     avatarmedium: "",
      //     avatarfull: "",
      //     lastlogoff: 0,
      //     timecreated: 0
      //   }
      // ]});
      // this.setState({recentlyPlayed: {total_count: 0, games: []}});
      // this.setState({ownedGames: {game_count: 0, games: []}});
      // this.setState({gamesList: []});
      // this.setState({wishlist: {}});
      // this.setState({badges: []});
    }
    
    this.setState({loading: false});
    
    console.log(this.state.playerSummary);
    console.log(this.state.friendsList);
    console.log(this.state.friendsSummary);
    console.log(this.state.recentlyPlayed);
    console.log(this.state.ownedGames);
    console.log(this.state.wishlist);
    console.log(this.state.badges);
  };

  handleSubmit(event) {
    event.preventDefault();
  };

  render() {
    
    const {friendsList, recentlyPlayed, playerSummary, friendsSummary} = this.state;

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

    function FriendSummary(props) {
      const friendsSummary = props.friendsSummary;
      if(friendsSummary[0].steamid !== "")
      {
        friendsSummary.map((friend, i) => {
          return (
            <React.Fragment>
              <p key={i}>
                Friend Summary: {friend.personaname}
              </p>
              <img alt="friend profile" src={friend.avatar}/>
            </React.Fragment>
          )
        });
      } else {
        return(null);
      }
    }

    function recentlyPlayedBar(props) {
      let ls = props.labels;
      let ds = props.dataset;
      let rp = props.recentlyPlayed;
      ls = rp.map((gamen) => {})
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

          <div className="mainDiv" id="mainDiv">
       
          <Row>
            <Col md lg="4">
              <Card>
                <Card.Img variant="top" src={playerSummary.avatarfull} />
                <Card.Body>
                  <Card.Title>{playerSummary.personaname}</Card.Title>
                  <Card.Link href={playerSummary.profileurl} target="_blank">Steam Profile</Card.Link>
                  <Card.Text>
                    Last Log Off: {timeConverter(playerSummary.lastlogoff)}
                    <br></br>
                    Profile Created: {timeConverter(playerSummary.timecreated)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md lg="4"></Col>
            <Col md lg="4" >
                {/* <FriendSummary friendsSummary={friendsSummary}/> */}
                <h3>Friends list</h3>
                        <ul className="friendsList">
                        {friendsSummary.map((friend, i) => {
                          return (
                              <li className="friendCell">
                              <img className="friendImg" alt="friend profile" src={friend.avatar}/>
                              <a href={friend.profileurl}>{friend.personaname}</a>
                              </li>
                          )
                        })}
                        </ul>
            </Col>
          </Row>
          <Row>
            <Col md lg="12" className="recentDiv">
                <h2>Recently Played</h2>
                <React.Fragment>
                  {recentlyPlayed.games.map((game, i) => {
                    return (
                      <Card className="recentGameCards">
                      <Card.Img variant="top" src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"} />
                      <Card.Body>
                        <Card.Title>{game.name}</Card.Title>
                        <Card.Link href={"https://store.steampowered.com/app/" + game.appid + "/"} target="_blank">Steam Store Page</Card.Link>                      
                      </Card.Body>
                    </Card>
                    )
                  })}
                </React.Fragment>
            </Col>
            
            {/* <Col>
              <Bar
                data={this.state}
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
            </Col> */}
          </Row>

          </div>
        </Container>
    );
  }
}

export default App;
