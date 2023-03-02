import React, {useState, useEffect}from "react";
import Today from "./Date";
import SearchBar from "./SearchBar";
import SpotifyPlayer from 'react-spotify-web-playback';
import Cookies from "js-cookie";


const Home = () => {


  const [token, setToken] = useState('');
  const [song, setSong] = useState('');
  
  useEffect(()=>{
    setToken(Cookies.get('token'))
  })
  return(
    <div>
      <div id="button-container">
        <button id="signout-button">Sign out</button>
      </div>
      <div id="center-display-container">
        <Today/>
        <SearchBar/>
        <SpotifyPlayer token={token}/>
      </div>
    </div>
  )
}

export default Home;