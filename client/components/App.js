
import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Cookies from "js-cookie";

import Login from "./Login.js";
import Home from "./Home.js";

const App = () => {
  return(
    <div>
      {Cookies.get('id')
      ?<Home/>
      :<Login/>

      }
    </div>
  )
}

export default App;