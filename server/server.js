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
  let state = generateRandomStr(16);
  res.cookie(stateKey, state);
  //set scope to allow for access to all spotify actions
  let scope = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-modify',
    'user-follow-read',
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read', 
    'user-library-modify',
    'user-read-private', 
    'user-read-email', 
  ];
  //creates an authorize url and redirects to it
  const url = spotifyApi.createAuthorizeURL(scope, state)
  console.log('in login')
  return res.redirect(url)
})

app.get('/callback', async (req,res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log('in callback');

  if (state === null || state !== storedState) {
    res.status(400).send('error logging into Spotify')
  }
  else{
    res.clearCookie(stateKey);
    try{
      const receivedTokens = await spotifyApi.authorizationCodeGrant(code);
      spotifyApi.setAccessToken(receivedTokens.body.access_token);
      spotifyApi.setRefreshToken(receivedTokens.body.refresh_token);
      console.log(receivedTokens.body)
      res.redirect('/home')
    }
    catch(error){
      res.status(400).send(error)
    }
  }
})

app.get('/home', async(req,res) => {
  try{
    console.log('spotifyApi')

    const user = await spotifyApi.getMe();
    const resUser = {
      name: user.body.display_name,
      id: user.body.id
    }
    res.locals.user = resUser;
    res.cookie('id', user.body.id)
    res.redirect('http://localhost:8080')
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.get('/refresh', async (req, res) => {
  try{
    const newAccToken = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(newAccToken.body.access_token);
  }
  catch (error){
    res.status(400).send(error)
  }
})

console.log('on port 3000')
app.listen(3000)