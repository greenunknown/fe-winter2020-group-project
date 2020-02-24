import React, { Component } from 'react';
// import { render } from 'react-dom';

class App extends Component{
  state = {
    data: null
  };
 
  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => res.text())
      .then(res => {
        this.setState({ data: res });
      })
      .catch(err => console.log(err));
  };
  
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('http://localhost:5000/games');
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
        <p>{this.state.data}</p>
      </div>
    );
  }
}

export default App;
