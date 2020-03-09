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
        if (Object.keys(dataJSON[3].response).length === 0) {
          this.setState({recentlyPlayed: {total_count: 0, games: []}});
        } else {
          this.setState({recentlyPlayed: dataJSON[3].response});
        }
        if (Object.keys(dataJSON[4].response).length === 0) {
          this.setState({recentlyPlayed: {game_count: 0, games: []}});
        } else {
          this.setState({ownedGames: dataJSON[4].response});
        }
        this.setState({gamesList: dataJSON[5].applist.apps});
        console.log(dataJSON[6]);
        if(dataJSON[6].success === 2)
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
                        <div style={{border: "5px solid #007bff", "border-radius": "12px"}}>
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

    function UserProfile(props) {
      const playerSummary = props.playerSummary;
      const badges = props.badges;

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

    function TopTenOwnedGames(props) {
      const games = props.games;
      const gameslist = props.gameslist;
      const ls = games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).slice(0, 10).map(game => game.appid);
      const d = games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).slice(0, 10).map((game) => game.playtime_forever);
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
              <UserProfile playerSummary={this.state.playerSummary} badges={this.state.badges}/>
            </Col>
            <Col md lg="3">
              <FriendSummary /*playerSummary={this.state.playerSummary}*/ friendsSummary={this.state.friendsSummary}/>
            </Col>
            <Col md lg="5">
              <Wishlist wishlist={this.state.wishlist} />
            </Col>
          </Row>
          <Row>
            <Col md lg="4">
                <RecentlyPlayed recentlyPlayed={recentlyPlayed}/>
                {/* <h2>Recently Played</h2>
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
                </React.Fragment> */}
            </Col>
          </Row>
          <Row>
            <Col>
              {/* Display the charts for recently played and top ten played owned games */}
              <AccordionComponent header="Steam Statistics" body={
                <React.Fragment>
                  <RecentlyPlayedBar games={this.state.recentlyPlayed.games}/>
                  <TopTenOwnedGames games={this.state.ownedGames.games} gameslist={this.state.gamesList}/>
                </React.Fragment>
              }/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
