import React, { Component } from 'react';
// import { render } from 'react-dom';

class App extends Component{
  state = {
    responseFromServer: null,
    data: null,
    userid: null,
    success: null,
  };
 
  // DO WE NEED THIS?
  // componentDidMount() {
  //     // Call our fetch function below once the component mounts
  //   this.callBackendAPI()
  //     .then(res => res.text())
  //     .then(res => {
  //       let resjson = JSON.parse(res);
  //       // console.log(resjson);
  //       this.setState({ data: res});//, userid: resjson.response.steamid, success: resjson.response.success });
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
      const body = await response.text();
      console.log(body);
      // this.setState({ responseFromServer: body });
      // console.log(this.responseFromServer);
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
        <p>{this.state.data}</p>
    
      </div>
    );
  }
}

export default App;
