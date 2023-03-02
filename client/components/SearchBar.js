import React, {useState} from "react";

const SearchBar = () => {

  let song = ''

  const [searchList, setSearchList] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault();
  }

  const handleChange = async(event) =>{
    event.preventDefault()
    song = event.target.value
        
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

    setSearchList(data)

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