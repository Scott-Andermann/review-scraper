import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import './App.css';

let id

function App() {
  const [webPage, setWebPage] = useState('https://www.amazon.com/Sceptre-Monitor-Speakers-Machine-C249W-1920RN/dp/B09M2SQ3PJ');
  const [titles, setTitles] = useState([]);
  const [clientID, setClientID] = useState('')
  const [csvData, setCsvData] = useState([])
  // titles data structure: 
  // [{title: String, complete: Bool}]
  const [listening, setListening] = useState(false);
  
  useEffect(() => {
    const events = new EventSource('http://localhost:4000/data');

    events.onopen = () => {
      console.log('SSE opened');
    }

    events.onmessage = (event) => {
      const response = JSON.parse(event.data)

      if (response.data.clientID) {
        setClientID(response.data.clientID)
      }
      if (response.data.type === 'scrape'){
        console.log(response.data);
        setTitles(prev => prev.map(obj => {
          if (obj.id === response.data.id) {
            return {...obj, complete: true};
          }
        
          return obj;
        }))
      }
      if (response.data.type === 'titles'){
        console.log(response.data)
        setTitles(response.data.titles);
      }
      if (response.data.type === 'getFromCSV') {
        
        // console.log(response.data);
        setCsvData(response.data.csvData)
      }
      if (response.data.type ===  'note') console.log(response.data.message);

      // else console.log(response.data);
    };

    events.onerror = (e) => {
      console.log('Error: ', e);
    }
    return () => {
      events.close();
    }

  }, []);

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
      body: JSON.stringify({clientID: clientID, itemID: itemID }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    try {
      const response = await fetch('http://localhost:4000/add', requestOptions)
      
    } catch (e) {
      console.log('Error: ', e);
    }
  }
  
  const deleteItem = async (title) => {
    console.log('delete this item: ', title);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({clientID: clientID, itemTitle: title }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    console.log(titles);
    try {
      const response = await fetch('http://localhost:4000/delete', requestOptions)
      setTitles(prev => prev.filter(element => element.title !== title))
    } catch (e) {
      console.log('Error: ', e);
    }
  }
  
  const downloadItem = async (title) => {
    const requestOptions = {
      method: "post",
      body: JSON.stringify({clientID: clientID, itemTitle: title }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }
    console.log(titles);
    try {
      const response = await fetch('http://localhost:4000/download', requestOptions)
    } catch (e) {
      console.log('Error: ', e);
    }
    
  }

  const getData = async (title) => {
    const requestOptions = {
      method: "post",
      body: JSON.stringify({clientID: clientID, title: title}),
      headers: { "Content-type": "application/json; charset=UTF-8"}
    }
    try {
      const response = await fetch('http://localhost:4000/get_data', requestOptions)
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
        {titles.map(title => <li key={title.title}>
            {title.title} - {title.id} - {title.complete? 'finished' : 'not finished'}
            <button onClick={() => deleteItem(title.title)}>Delete</button>
            <button onClick={() => downloadItem(title.title)}>Download</button>
            <button onClick={() => getData(title.title)}>Get Data</button>
          </li>)}
      </ul>}
      {/* <p><a href={reviewPage} target='_blank'>See Reviews</a></p> */}
      {csvData.length > 0 && <Graph data={csvData}/>}
    </div>
  );
}

export default App;
