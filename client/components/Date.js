import React, {useState} from "react";

const Today = () => {

  const dateToString = (weekday, month, day, year) => {
    let str = ''
    switch (weekday){
      case 0: str = str.concat('Sun '); break
      case 1: str = str.concat('Mon '); break
      case 2: str = str.concat('Tues '); break
      case 3: str = str.concat('Wed '); break
      case 4: str = str.concat('Thurs '); break
      case 5: str = str.concat('Fri '); break
      case 6: str = str.concat('Sat '); break
    }
    switch (month){
      case 0: str = str.concat('January '); break
      case 1: str = str.concat('February '); break
      case 2: str = str.concat('March '); break
      case 3: str = str.concat('April '); break
      case 4: str = str.concat('May '); break
      case 5: str = str.concat('June '); break
      case 6: str = str.concat('July '); break
      case 7: str = str.concat('August '); break
      case 8: str = str.concat('September '); break
      case 9: str = str.concat('October '); break
      case 10: str = str.concat('November '); break
      case 11: str = str.concat('December '); break
    }
    str = str.concat(`${day} ${year}`)
    return str;
  }

  let today = new Date()
  today = dateToString(today.getDay(), today.getMonth(), today.getDate(), today.getFullYear());
  const [date, setDate] = useState(today);

  return(
    <div>
      <h1>
        {date}
      </h1>
    </div>
  )
}

export default Today;