const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');
require('dotenv').config();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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
    'streaming'
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
      res.redirect('/home')
    }
    catch(error){
      res.status(400).send(error)
    }
  }
})

app.get('/home', async(req,res) => {
  try{
    const user = await spotifyApi.getMe();

    res.cookie('id', user.body.id)
    res.cookie('token', spotifyApi.getAccessToken())
    res.redirect('http://localhost:8080')
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.get('/test', (req, res)=>{
  //console.log(spotifyApi.getAccessToken())
  const resObj = {
    token: spotifyApi.getAccessToken(),
    song: '4iV5W9uYEdYUVa79Axb7Rh'
  }
  res.json(resObj)
})

app.post('/search', async(req, res) => {
  console.log(req.body.q)
  const tracks = await spotifyApi.searchTracks(req.body.q)
  console.log(tracks.body)
  res.status(200).send()
})

app.get('/refresh', async (req, res) => {
  try{
    const newAccToken = await spotifyApi.refreshAccessToken()
    spotifyApi.setAccessToken(newAccToken.body.access_token);
    res.send(spotifyApi.getAccessToken());
  }
  catch (error){
    res.status(400).send(error)
  }
})

console.log('on port 3000')
app.listen(3000)