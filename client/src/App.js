import React, { Component } from 'react';
// import { render } from 'react-dom';

class App extends Component{
  state = {
    playerSummary: null,
    friendsList: null,
    recentlyPlayed: null,
    ownedGames: null,
    gamesList: null
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

  render() {
    return (
      <div>
        <h1>Steam ID</h1>
        <form>
          <label>Steam User ID: 
            <input type="text" name="usersteamid" onChange={e => this.setState({ userid: e.target.value })}/> 
          </label>
          <input type="button" value="Submit" onClick={this.callBackendAPI}/>
        </form>
    
      </div>
    );
  }
}

export default App;
