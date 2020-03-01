import React, { Component } from 'react';
// import { render } from 'react-dom';

class App extends Component{
  state = {
    playerSummary: {
      steamid: "",
      personaname: "",
      profileurl: "",
      avatar: "",
      avatarmedium: "",
      avatarfull: "",
      lastlogoff: 0,
      timecreated: 0
    },
    friendsList: [
      {
        steamdid: "",
        relationship: "",
        friend_since: 0
      }
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

  // function displayPlayerSummary() {
  //   const playerSum = this.state.playerSummary.map((stat, index) => {
  //     <p key={index}>{stat}</p>
  //   });

  //   return (
      
  //   )
  // };

  render() {
    return (
      <div>
        <h1>Steam ID</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Steam User ID: 
            <input type="text" name="usersteamid" onChange={e => this.setState({ userid: e.target.value })}/> 
          </label>
          <input type="Submit" value="Submit" onClick={this.callBackendAPI} readOnly/>
        </form>
        <p>{this.state.playerSummary.steamid}</p>
        {/* <p>{playerSum}</p> */}
        {/* <p>{JSON.stringify(this.state.playerSummary)}</p> */}
        <img src={this.state.playerSummary.avatarfull} alt="player avatar"></img>
      </div>
    );
  }
}

export default App;
