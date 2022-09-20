import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [webPage, setWebPage] = useState('https://www.amazon.com/Sceptre-Monitor-Speakers-Machine-C249W-1920RN/dp/B09M2SQ3PJ');
  const [titles, setTitles] = useState([]);
  const [listening, setListening] = useState(false);
  
  useEffect(() => {
    const events = new EventSource('http://localhost:4000/events');

    events.onmessage = (event) => {
      console.log(event);
      // const parsedData = JSON.parse(event.data);
      // setTitles(prev => prev.concat(parsedData))
    };
    console.log('listening');
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
      body: JSON.stringify({ itemID: itemID }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    // console.log(requestOptions);
    // console.log(requestOptions.body);
    try {
      const response = await fetch('http://localhost:4000/add', requestOptions)
      console.log(response);
      // const data = await response.json()
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
      <></>
      {/* <p><a href={reviewPage} target='_blank'>See Reviews</a></p> */}
    </div>
  );
}

export default App;
