import React, {useState} from "react";
import SearchItem from "./SearchItem";

const SearchBar = () => {

  let song = ''

  const [searchList, setSearchList] = useState([])
  const [songItems, setSongItems] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  }

  const handleChange = async(event) =>{
    event.preventDefault()
    song = event.target.value
    
    if (song.replace(/\s/g, '').length === 0) return
    const searchedSongs = await fetch('/api/search', {
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

    const items = searchList.map((song, i) => {
      return(
        <SearchItem
          key={i}
          artist = {song.artists[0].name}
          song = {song.name}
          uri = {song.uri}
        />
      )
    })
    setSongItems(items)
  }


  return(
    <div id="searchbar-container">
      <form id="song-search" onSubmit={handleSubmit} >
        <input type='text' onChange={handleChange} placeholder='Search up song to queue' id="searchbar" autoComplete="off"></input>
      </form>
      <div className="song-search-item-container">
        {songItems}
      </div>
    </div>
  )
}

export default SearchBar;