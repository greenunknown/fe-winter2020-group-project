import React, { Component } from 'react';
// import { render } from 'react-dom';

class App extends Component{
  state = {
    data: null,
    userid: null,
    success: null
  };
 
  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => res.text())
      .then(res => {
        let resjson = JSON.parse(res);
        console.log(resjson);
        this.setState({ data: res, userid: resjson.response.steamid, success: resjson.response.success });
      })
      .catch(err => console.log(err));
  };
  
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('http://localhost:5000/search');
    const body = await response;
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div>
        <h1>Hello World, React!</h1>
        <form>
          <label>Steam User ID: 
            <input type="text" name="userid" /> 
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>{this.state.data} sdaflkjlaksdjf{this.state.userid}</p>
        <p></p>
        <p>{this.state.success}</p>
      </div>
    );
  }
}

export default App;
