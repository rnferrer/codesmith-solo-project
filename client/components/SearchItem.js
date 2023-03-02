import React from "react";

const SearchItem = ({artist, song, uri}) => {

  const handleClick = async (e) => {
    e.preventDefault();
    const enqueue = await fetch('/api/enqueue', {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        uri
      })
    })
  }
  return(
    <div id="song-item" onClick={handleClick}>
      <h2>{song} - {artist}</h2>
    </div>
  )
}

export default SearchItem;