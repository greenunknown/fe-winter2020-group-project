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
    gamesList: []
  };
 
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: this.state.userid }),
    });
      const data = await response.text();
      if(data !== "No match") 
      {
        var dataJSON = JSON.parse(data);
        this.setState({playerSummary: dataJSON[0].response.players[0]})
        this.setState({friendsList: dataJSON[1].friendslist.friends});
        this.setState({friendsSummary: dataJSON[2].response.players})
        this.setState({recentlyPlayed: dataJSON[3].response});
        this.setState({ownedGames: dataJSON[4].response});
        this.setState({gamesList: dataJSON[5].applist.apps});
      } else {
        console.log("No match found!");
        this.setState({playerSummary: [
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
        ]});
        this.setState({friendsList: []});
        this.setState({friendsSummary: [
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
        ]});
        this.setState({recentlyPlayed: {total_count: 0, games: []}});
        this.setState({ownedGames: {game_count: 0, games: []}});
        this.setState({gamesList: []});
      }    

      console.log(this.state.playerSummary);
      console.log(this.state.friendsList);
      console.log(this.state.friendsSummary);
      console.log(this.state.recentlyPlayed);
      console.log(this.state.ownedGames);
  };

  handleSubmit(event) {
    event.preventDefault();
  };

  render() {
    const {friendsList, recentlyPlayed, playerSummary} = this.state;

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

    return (
      <div>
        <Container>
          <h1>Steam Dash</h1>
          <Row>
            <Col md lg="4">
              <Form onSubmit={this.handleSubmit}>
                  <InputGroup className="mb-1">
                    <FormControl placeholder="Steam Username" aria-label="Steam Username" onChange={e => this.setState({ userid: e.target.value })}/>
                    <InputGroup.Append>
                      <Button type="Submit" value="Submit" onClick={this.callBackendAPI} readOnly>Submit</Button>
                    </InputGroup.Append>
                  </InputGroup>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md lg="4">
              <Card >
                <Card.Img variant="top" src={playerSummary.avatarfull} />
                <Card.Body>
                  <Card.Title>{playerSummary.personaname}</Card.Title>
                  <Card.Link href={playerSummary.profileurl}>Steam Profile</Card.Link>
                  <Card.Text>
                    Last Log Off: {timeConverter(playerSummary.lastlogoff)}
                    <br></br>
                    Profile Created: {timeConverter(playerSummary.timecreated)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <p>Friends List</p>
              <div>
                {friendsList.map((friend, i) => {
                  return (
                    <p key={i}>
                      Friend: {friend.steamid}
                      <br></br>
                      Friend since: {timeConverter(friend.friend_since)}
                    </p>
                    )
                })}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md lg="4">
                <h2>Recently Played</h2>
                <React.Fragment>
                  {recentlyPlayed.games.map((game, i, j, k) => {
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
