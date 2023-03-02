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
app.use(express.json());
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

app.get('/callback', async (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log('in callback');

  //response we received from spotify/authorize is an error
  if (state === null || state !== storedState) res.status(400).send('error logging into Spotify')
  
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

app.get('/token', (req, res) => {
  res.status(200).json(spotifyApi.getAccessToken());
})

app.get('/home', async (req, res) => {
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

app.post('/api/enqueue', async (req, res) => {

  //get the player on the application
  const getDevices = await spotifyApi.getMyDevices()
  const devices = getDevices.body.devices
  let WebPlayer

  for (let item of devices){
    if (item.name === 'Spotify Web Player'){
      WebPlayer = item  
      break;
    }
  }

  //set react player as the active player
  if(WebPlayer.is_active === false){
    const newPlayback = await spotifyApi.transferMyPlayback([WebPlayer.id], {play: true})
    //console.log(newPlayback)
  }
  const newSong = await spotifyApi.addToQueue(req.body.uri);
  console.log(newSong)
  res.status(200).json('hi')

})

app.post('/api/search', async(req, res) => {
  //search for inputted track and return first 7 results
  const searched = await spotifyApi.searchTracks(req.body.q);
  const tracks = searched.body.tracks.items.slice(0,7)
  const trackInfo = [];

  //get only properties that we need
  for (let i=0; i<tracks.length; i++){
    const {artists, href, id, name, uri} = tracks[i];
    trackInfo.push({artists, href, id, name, uri})
  }

  res.status(200).json(trackInfo)
})


console.log('on port 3000')
app.listen(3000)