# fe-winter2020-group-project

## Project description

A dashboard front-end application that displays Steam information or Blizzard information for users. We will be using the Steam API or Blizzard API.

## Project members

* Brandon Le
* Daniel Song

## Setup

1. Clone the repo with `git clone`
2. Install npm modules with `npm install` in the `server` folder and `client` folder. 
3. Get a Steam APi key from [this link](https://steamcommunity.com/dev)
   1. The key should be stored in a file called `steamconfig.json` in the `server` folder in the following format:

    ```json
    {
        "apiKey": "KEY"
    }
    ```

4. Start the server in one terminal:

```bash
cd server
node server.js
```

5. Start the client in another terminal:

```bash
cd client
npm start
```
