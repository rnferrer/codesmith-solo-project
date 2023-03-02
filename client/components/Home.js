import React, {useState, useEffect}from "react";
import Today from "./Date";
import SearchBar from "./SearchBar";
import SpotifyPlayer from 'react-spotify-web-playback';


const Home = () => {


  const [token, setToken] = useState('');
  const [song, setSong] = useState('');
  
  useEffect(()=>{
    fetch('/test')
    .then(data => data.json())
    .then(data => {
      setToken(data.token); 
      setSong(data.song);     
    })
  })
  return(
    <div>
      <div id="button-container">
        <button id="signout-button">Sign out</button>
      </div>
      <div id="center-display-container">
        <Today/>
        <SearchBar/>
        {/* <SpotifyPlayer token={token} song={song}/> */}
      </div>
    </div>
  )
}

export default Home;