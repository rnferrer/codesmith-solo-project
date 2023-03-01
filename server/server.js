const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const stateKey = 'spotify_auth_state';
const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId,
  clientSecret
});


const generateRandomStr = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.use(cookieParser());

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

app.get('/login', (req, res) => {
  //create a state key to prevent cross-site request forgery
  console.log('hi')
  let state = generateRandomStr(16);
  res.cookie(stateKey, state);
  //set scope to allow for reading user email, their library, and their state of playback
  let scope = ['user-read-private', 'user-read-email', 'user-library-read', 'user-read-playback-state'];
  //creates an authorize url and redirects to it
  res.redirect(spotifyApi.createAuthorizeURL(scope, state))
})

app.get('/callback', async (req,res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.status(400).send('error logging into Spotify')
  }
  else{
    res.clearCookie(stateKey);
    try{
      const receivedTokens = await spotifyApi.authorizationCodeGrant(code);
      spotifyApi.setAccessToken(receivedTokens.body.access_token);
      spotifyApi.setRefreshToken(receivedTokens.body.refresh_token);
      console.log(receivedTokens)
      res.status(200).send(receivedTokens.body.refresh_token);
    }
    catch(error){
      res.status(400).send(error)
    }
  }
})
console.log('on port 3000')
app.listen(3000)