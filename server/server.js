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
      // const body = {
      //   grant_type: 'authorization_code',
      //   code,
      //   redirect_uri
      // }
      // const headers = {
      //   Authorization: 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }

      // const response = await fetch('https://accounts.spotify.com/api/token', {
      //   method: 'post',
      //   body: querystring.stringify(body),
      //   headers
      // })

      // const data = await response.json()
      // const sendStuff = {
      //   refresh_token: data.refresh_token,

      // }
      const refAndAccTok = await spotifyApi.authorizationCodeGrant(code);
      res.status(200).send(refAndAccTok.body.refresh_token);

    }
    catch(error){

    }
  }
})
console.log('on port 3000')
app.listen(3000)