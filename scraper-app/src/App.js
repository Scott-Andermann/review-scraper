import React, { useState, useEffect } from 'react';
import Graph from './Graph/Graph';
import './App.css';

let id

function App() {
  const [webPage, setWebPage] = useState('https://www.amazon.com/Sceptre-Monitor-Speakers-Machine-C249W-1920RN/dp/B09M2SQ3PJ');
  const [titles, setTitles] = useState([]);
  const [clientID, setClientID] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [titleList, setTitleList] = useState([]);
  const [pageCount, setPageCount] = useState('10');
  // titles data structure: 
  // [{title: String, complete: Bool}]
  const [listening, setListening] = useState(false);
  
  useEffect(() => {
    const events = new EventSource('http://localhost:4000/data');

    events.onopen = () => {
      console.log('SSE opened');
      setListening(true)
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
        // console.log(response.data)
        setTitles(response.data.titles);
      }
      if (response.data.type === 'getFromCSV') {
        
        console.log(response.data);
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
      setListening(false)
    }

  }, []);

  const getID = () => {
    try {
      const urlArray = webPage.split('/');
      const index = urlArray.findIndex(element => element === 'dp');

      return urlArray[index + 1].slice(0,10)
    } catch (e) {
      console.log('Error: ', e);
    }
  }


  const addItem = async () => {
    const itemID = getID();
    const requestOptions = {
      method: "post",
      body: JSON.stringify({clientID: clientID, itemID: itemID, pageCount: pageCount }),
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

  const getData = async () => {
    console.log(titleList);
    const requestOptions = {
      method: "post",
      body: JSON.stringify({clientID: clientID, titleList: titleList}),
      headers: { "Content-type": "application/json; charset=UTF-8"}
    }
    try {
      const response = await fetch('http://localhost:4000/get_data', requestOptions)
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  const onChangePageCount = (e) => {
    if (e.target.value <= 50) {
      setPageCount(e.target.value)
    }
  }

  const changeCheck = (title) => {
    if (!titleList.includes(title))
      setTitleList(prev => [...prev, title])
    if (titleList.includes(title))
      setTitleList(prev => prev.filter(element => element !== title))
  }

  return (
    <div className="App">
      <h1>Amazon Review Scraper</h1>
      <div className={listening ? 'status green': 'status red'}></div>
      <p>Enter URL of item: </p>
      <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
      <button onClick={addItem}>Add Item</button>
      <p>Enter number of pages to scrape (max 50)</p>
      <input type='number' value={pageCount} onChange={onChangePageCount}></input>
      {titles.length > 0 && <ul>
        {titles.map(title => <li key={title.title}>
            <input type='checkbox' onChange={() => changeCheck(title.title)} disabled={!title.complete}></input>
            {title.title.slice(10,50)}... - <a href={`https://www.amazon.com/dp/${title.title.slice(0, 10)}`} target='_blank'>Link</a>
            {title.complete && <button onClick={() => deleteItem(title.title)} disabled={!title.complete}>Delete</button>}
            {title.complete && <button onClick={() => downloadItem(title.title)} disabled={!title.complete}>Download</button>}
          </li>)}
      </ul>}
      {/* <p><a href={reviewPage} target='_blank'>See Reviews</a></p> */}
      <button onClick={getData}>Update Chart</button>
      {csvData.length > 0 && <Graph data={csvData}/>}
    </div>
  );
}

export default App;
