import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./Login";

const App = () => {

  return(
    <Router>
      <div>
        hello?
        <Routes>
          <Route path='/' element={<Login/>}/>
        </Routes>
      </div>
    </Router>

  )
}

export default App;