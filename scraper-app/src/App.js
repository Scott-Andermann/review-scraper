import { response } from 'express';
import React, {useState} from 'react';
import './App.css';

function App() {
  const [webPage, setWebPage] = useState('');
  const [itemID, setItemID] = useState('');

  const getID = () => {
    try {
      const urlArray = webPage.split('/');
      const index = urlArray.findIndex(element => element === 'dp');
      console.log(index);

      setItemID(urlArray[index+1])
    } catch (e) {
      console.log('Error: ', e);
    }
  }


  const scrapeID = async () => {
    getID();
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({itemID: itemID})
    }
    const response = await fetch('https://localhost:4000/add', requestOptions)
    const data = await response.json()

  }

  return (
    <div className="App">
      <h1>Amazon Review Scraper</h1>
      <p>Enter URL of item: </p>
      <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
      <button onClick={scrapeID}>Click</button>
      {/* <p><a href={reviewPage} target='_blank'>See Reviews</a></p> */}
    </div>
  );
}

export default App;
