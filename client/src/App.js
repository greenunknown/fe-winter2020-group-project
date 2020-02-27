import React, { Component } from 'react';
// import { render } from 'react-dom';

class App extends Component{
  state = {
    responseFromServer: null,
    data: null,
    userid: null,
    playerSum: null,
    friends: null,
    recentPlayed: null,
    ownedGames: null,
    gameslist: null
  };
 
  // DO WE NEED THIS?
  // componentDidMount() {
  //     // Call our fetch function below once the component mounts
  //   this.callBackendAPI()
  //     .then(res => res.text())
  //     .then(res => {
  //       let resjson = JSON.parse(res);
  //       console.log(resjson);
  //       // this.setState({ data: res});//, userid: resjson.response.steamid, success: resjson.response.success });
  //       // console.log("response: ", response);
  //       // const body = await JSON.parse(response);
  //       // console.log("body: ", body);
  //       // this.setState({data: body});
  //       // this.setState({playerSum: body[0].response.players[0].steamid});
  //       // this.setState({friends: body[1].friendslist});
  //       // this.setState({recentlyPlayed: body[2].response.games});
  //       // this.setState({ownedGames: body[3].response.games});
  //       // this.setState({gameslist: body[4].applist.apps});
  //     })
  //     .catch(err => console.log(err));
  // };
  
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: this.state.userid }),
    });
    const body = await response;
    if (response.status !== 200) {
      throw Error(body.message) 
    } else {
      let resjson = await response.json();
      console.log(resjson, resjson[0]);
      // this.setState({ data: res});//, userid: resjson.response.steamid, success: resjson.response.success });
      // console.log("response: ", response);
      // const body = await JSON.parse(response);
      // console.log("body: ", body);
      // this.setState({data: body});
      // this.setState({playerSum: body[0].response.players[0].steamid});
      // this.setState({friends: body[1].friendslist});
      // this.setState({recentlyPlayed: body[2].response.games});
      // this.setState({ownedGames: body[3].response.games});
      // this.setState({gameslist: body[4].applist.apps});
    }
      // return body;

      // this.setState({ responseFromServer: body });
      // console.log(this.responseFromServer);
  };

  render() {
    const data = this.state.data ? '...loading' : <p>{this.state.data}</p>;
    return (
      <div>
        <h1>Steam ID</h1>
        <form>
          <label>Steam User ID: 
            <input type="text" name="usersteamid" onChange={e => this.setState({ userid: e.target.value })}/> 
          </label>
          <input type="button" value="Submit" onClick={this.callBackendAPI}/>
        </form>
        {/* {data} */}
        <p>Player summary: {this.state.playerSum}</p>
        {/* {this.state.playerSum.map(i => <p>{this.state.playerSum[i]}</p>)} */}
        {/* <p>Friends: {this.state.friends}</p> */}
      </div>
    );
  }
}

export default App;
