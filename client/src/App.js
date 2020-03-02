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
    friendsList: [
      // {
      //   steamdid: "",
      //   relationship: "",
      //   friend_since: 0
      // }
    ],
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
      var dataJSON = JSON.parse(data);
      this.setState({playerSummary: dataJSON[0].response.players[0]})
      this.setState({friendsList: dataJSON[1].friendslist.friends});
      this.setState({recentlyPlayed: dataJSON[2].response});
      this.setState({ownedGames: dataJSON[3].response});
      this.setState({gamesList: dataJSON[4].applist.apps});

      console.log(this.state.playerSummary);
      console.log(this.state.friendsList);
      console.log(this.state.recentlyPlayed);
      console.log(this.state.ownedGames);
  };

  handleSubmit(event) {
    event.preventDefault();
  };

  render() {
    const {friendsList, recentlyPlayed} = this.state;

    // Time converter function by shomrat from: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    // Retrieved on 3-2-20
    function timeConverter(UNIX_timestamp){
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
                <Card.Img variant="top" src={this.state.playerSummary.avatarfull} />
                <Card.Body>
                  <Card.Title>{this.state.playerSummary.personaname}</Card.Title>
                  <Card.Link href={this.state.playerSummary.profileurl}>Steam Profile</Card.Link>
                  <Card.Text>
                    Last Log Off: {timeConverter(this.state.playerSummary.lastlogoff)}
                    <br></br>
                    Profile Created: {timeConverter(this.state.playerSummary.timecreated)}
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
                <p>Recently Played</p>
                <div>
                  {recentlyPlayed.games.map((game, i, j, k) => {
                    return (
                      <div key={i}>
                        <Card >
                          <Card.Img variant="top" src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"} />
                          <Card.Body>
                            <Card.Title>{game.name}</Card.Title>
                            <Card.Link href={"https://store.steampowered.com/app/" + game.appid + "/"}>Steam Store Page</Card.Link>
                          </Card.Body>
                        </Card>
                        {/* <p>
                          Game: {game.name}
                        </p> */}
                        {/* console.log({"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"})
                        <img scr={"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"} alt="game logo" />  */}
                      </div>
                    )
                  })}
                </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
