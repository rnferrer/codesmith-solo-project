import React, {useState} from "react";

const SearchBar = () => {

  let song = ''

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(song)
        
    const searchedSongs = await fetch('/search', {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        "q": song
      })
    })
    const data = await searchedSongs.json();
    console.log(data)
  }

  const handleChange = async(event) =>{
    event.preventDefault()
    song = event.target.value

    //console.log(song)
  }
  return(
    <div id="searchbar-container">
      <h1>
        hello
      </h1>
      <form id="song-search" onSubmit={handleSubmit} >
        <input type='text' onChange={handleChange} placeholder='Search up song to queue' id="searchbar" ></input>
      </form>
    </div>
  )
}

export default SearchBar;