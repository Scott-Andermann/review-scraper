import React, { useState, useEffect } from 'react';
import './App.css';

let id

function App() {
  const [webPage, setWebPage] = useState('https://www.amazon.com/Sceptre-Monitor-Speakers-Machine-C249W-1920RN/dp/B09M2SQ3PJ');
  const [titles, setTitles] = useState([]);
  const [listening, setListening] = useState(false);
  
  useEffect(() => {
    const events = new EventSource('http://localhost:4000/data');

    events.onopen = () => {
      console.log('SSE opened');
    }

    // events.addEventListener('message', (e) => {
    //   console.log(e.data);
    // })

    events.onmessage = (event) => {
      const response = JSON.parse(event.data)

      if (response.data.id) {
        id = response.data.id
      }
      if (response.data.type === 'scrape')
        console.log(response);
      if (response.data.type === 'titles'){
        setTitles(response.data.titles);
      }
      // const parsedData = JSON.parse(event.data);
      // setTitles(prev => prev.concat(parsedData))
    };

    events.onerror = (e) => {
      console.log('Error: ', e);
    }
    return () => {
      events.close();
    }

  }, []);

  // const [itemID, setItemID] = useState('');
  const getID = () => {
    try {
      const urlArray = webPage.split('/');
      const index = urlArray.findIndex(element => element === 'dp');

      return urlArray[index + 1]
    } catch (e) {
      console.log('Error: ', e);
    }
  }


  const addItem = async () => {
    const itemID = getID();
    const requestOptions = {
      method: "post",
      body: JSON.stringify({id: id, itemID: itemID }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    try {
      const response = await fetch('http://localhost:4000/add', requestOptions)

    } catch (e) {
      console.log('Error: ', e);
    }
  }


  return (
    <div className="App">
      <h1>Amazon Review Scraper</h1>
      <p>Enter URL of item: </p>
      <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
      <button onClick={addItem}>Add Item</button>
      {titles.length > 0 && <ul>
        {titles.map(title => <li>{title}</li>)}
      </ul>}
      {/* <p><a href={reviewPage} target='_blank'>See Reviews</a></p> */}
    </div>
  );
}

export default App;
