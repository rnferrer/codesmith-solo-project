import React, {useState} from "react";
import { Navigate } from "react-router-dom";

const Login = () => {
  

  return(
    <div>
      <div id="login-container">
        <h1 id="login-title">Welcome to Spotifriends</h1>
        <button id="login-button"><a href="/login" className="login-atag">Log in with Spotify</a></button>
      </div>
    </div>
  )
}

export default Login;