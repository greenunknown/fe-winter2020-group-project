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
import Progress from 'react-bootstrap/ProgressBar';
import {Bar, Scatter, Pie} from 'react-chartjs-2';
import ProgressBar from 'react-bootstrap/ProgressBar';

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
    }
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
        this.setState({wishlist: {}});
        this.setState({badges: {
          player_xp: 0,
          player_level: 0,
          player_xp_needed_to_level_up: 0.0000000001
        }});
      }    

      console.log(this.state.playerSummary);
      console.log(this.state.friendsList);
      console.log(this.state.friendsSummary);
      console.log(this.state.recentlyPlayed);
      console.log(this.state.ownedGames);
      console.log(this.state.wishlist);
      console.log(this.state.badges);
      // console.log(this.state.gamesList);
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
                  backgroundColor: "rgba(0,123,255,1)",
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

    function Wishlist(props) {
      const wishlist = props.wishlist;
      
      if(wishlist.success === 2)
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
              <ListGroup as="ul" style={{overflow: 'auto', height: '460px'}}>
              {
                  wishlist_games.map((game, i) => {
                    return(
                      <WishlistGame game={game} appid={wishlist_appids[i]}/>
                    )
                  })
              }
              </ListGroup>
            }/>
          </React.Fragment>
        )
      }
    }
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
              <Card>
                <Card.Img variant="top" src={playerSummary.avatarfull} />
                <Card.Body>
                  <Card.Title>{playerSummary.personaname}</Card.Title>
                  <Card.Link href={playerSummary.profileurl} target="_blank">Steam Profile</Card.Link>
                  <Card.Text>
                    Last Log Off: {timeConverter(playerSummary.lastlogoff)}
                    <br></br>
                    Profile Created: {timeConverter(playerSummary.timecreated)}
                    <br></br>
                    Player Level: {this.state.badges.player_level}
                    <br></br>
                    Exp Progress: <ProgressBar now={(this.state.badges.player_xp / (this.state.badges.player_xp + this.state.badges.player_xp_needed_to_level_up))*100} 
                      label={this.state.badges.player_xp_needed_to_level_up + "\tneeded to level up"}/>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <h2>Friends List</h2>
              <div>
                {/* <FriendSummary friendsSummary={friendsSummary}/> */}
                <Accordion defaultActiveKey="0">
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Friends
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        {friendsSummary.map((friend, i) => {
                          return (
                            <React.Fragment key={i}>
                              <p>
                                Friend Summary: {friend.personaname}
                              </p>
                              <img alt="friend profile" src={friend.avatar}/>
                            </React.Fragment>
                          )
                          })}
                        </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <Accordion defaultActiveKey="0">
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Friends
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        {friendsList.map((friend, i) => {
                          return (
                            <p key={i}>
                              Friend: {friend.steamid}
                              <br></br>
                              Friend since: {timeConverter(friend.friend_since)}
                            </p>
                            )
                        })}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            </Col>
            <Col>
              <Wishlist wishlist={this.state.wishlist} />
            </Col>
          </Row>
          <Row>
            <Col md lg="4">
                <h2>Recently Played</h2>
                <React.Fragment>
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
            </Col>
          </Row>
          <Row>
            <Col>
              <AccordionComponent header="Steam Statistics" body={
                <RecentlyPlayedBar games={this.state.recentlyPlayed.games}/>
              }/>
              {/* <RecentlyPlayedBar games={this.state.recentlyPlayed.games}/> */}
              <Bar
                data={
                  {
                    labels: this.state.ownedGames.games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).map(game => game.appid),
                    datasets: [
                      {
                        label: "Playtime (Minutes)",
                        backgroundColor: "rgba(0,123,255,1)",
                        data: this.state.ownedGames.games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).map((game) => game.playtime_forever)
                      }
                    ]
                  }
                }
                options={{
                  title:{
                    display:true,
                    text:'Owned Games Playtime',
                    fontSize:20
                  },
                  legend:{
                    display:true,
                    position:'right'
                  }
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
