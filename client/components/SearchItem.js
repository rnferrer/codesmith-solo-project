import React from "react";

const SearchItem = ({artist, song, image, uri}) => {

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
      <img src={image.url}></img>
      <p>{song} - {artist}</p>
    </div>
  )
}

export default SearchItem;