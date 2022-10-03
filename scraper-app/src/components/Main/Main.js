import React, { useState, useEffect } from "react";
import axios from 'axios';
import Graph from "../Graph/Graph";
import Login from "../Login/Login";
import Logout from "../Logout/Logout"
import InputFields from '../InputFields/InputFields'
import FileList from "../FileList/FileList";
import './Main.css';

const url = '/all_objects';

function App({token, removeToken}) {
    const [allData, setAllData] = useState(null);
    const [webPage, setWebPage] = useState('');
    const [pageCount, setPageCount] = useState(5);
    const [selection, setSelection] = useState([]);
    const [csvData, setCsvData] = useState([]);
    

    // const {token, removeToken, saveToken} = useToken();

    const getID = () => {
        try {
            const urlArray = webPage.split('/');
            const index = urlArray.findIndex(element => element === 'dp');
            if (urlArray.includes('www.amazon.com')) {
                if (urlArray[index + 1].length >= 10)
                    return urlArray[index + 1].slice(0, 10)
            }
            return undefined
        } catch (e) {
            console.log('Error: ', e);
            return undefined
        }
    }

    const getData = async () => {
        const directory = JSON.parse(localStorage.getItem('directory'))
        console.log(directory);
        const response = await axios.get(`${url}?directory=${directory}`)
        console.log(response.data);
        setAllData(response.data.data)
    }

    const addItem = async () => {
        const id = getID();
        const body = {
            id: id
        }
        const response = await axios.post('/add', body)
        console.log(response);
        // add to all data but without scraped flag
        setAllData(prev => [...prev, { title: id + response.data.title + '.csv', id: id, complete: false }])
        startScraping({id: id, title: id + response.data.title})
    }

    const onPageChange = (e) => {
        if (e.target.value < 50) {
            setPageCount(e.target.value)
        }
    }

    const startScraping = async ({id, title}) => {
        const directoryString = localStorage.getItem('directory');
        const directory = JSON.parse(directoryString);
        const body = {
            id: id,
            title: title,
            pageCount: pageCount,
            directory: directory
        }
        const response = await axios.post('/scrape', body)
        console.log(response);
        // should I call getData() again after scraping is finished?  That way server controls then data list
        setAllData(prev => prev.map(obj => {
            if (obj.id === id) {
                return { ...obj, complete: true };
            }
            return obj;
        }))
    }

    const removeItem = async (title) => {
        setAllData(prev => prev.filter(element => element.title !== title))
    }

    const deleteItem = async (title) => {
        console.log('delete item ', title);
        const body = {
            itemTitle: title
        }
        const response = await axios.post('/delete', body)
        console.log(response);
        setAllData(prev => prev.filter(element => element.title !== title))
        setSelection(prev => prev.filter(element => element !== title))
    }

    const downloadItem = async (title) => {
        // need to connect with backend
        const response = await axios.get('/download')
    }

    const changeCheck = (title) => {
        if (!selection.includes(title))
          setSelection(prev => [...prev, title])
        if (selection.includes(title))
          setSelection(prev => prev.filter(element => element !== title))
      }

    const updateCharts = async () => {
        const body = {
            selection: selection
        }

        const response = await axios.post('/get_data', body)
        // console.log(response.data);
        setCsvData(response.data)
    }

    // console.log(csvData);

    useEffect(() => {
        getData();
    }, []);


    return (
        <div className='App'>
            <h1>Amazon Review Scraper</h1>
            <Logout removeToken={removeToken} />
            <h4>Enter URL of item:</h4>
            {/* Replace with Input component */}
            <InputFields webPage={webPage} setWebPage={setWebPage} addItem={addItem} pageCount={pageCount} onPageChange={onPageChange} />
            {/* <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
            <button onClick={addItem}>Add item</button>
            <h4>Enter number of pages to scrape (max 50)</h4>
            <input type='number' value={pageCount} onChange={onPageChange}></input> */}
            <FileList allData={allData} selection={selection} setSelection={setSelection} changeCheck={changeCheck} deleteItem={deleteItem} downloadItem={downloadItem} />
            <button onClick={updateCharts}>Update Charts</button>
            {csvData.length > 0 && <Graph data={csvData} />}
        </div>
    );
}


export default App;