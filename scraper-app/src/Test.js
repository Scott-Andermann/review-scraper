import React, { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';

const url = '/all_objects';
const addUrl = '/add';

const Test = () => {
    const [allData, setAllData] = useState(null);
    const [webPage, setWebPage] = useState('');
    const [pageCount, setPageCount] = useState(5);
    const [selection, setSelection] = useState([]);

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
        const response = await axios.get(url)
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
        setAllData(prev => [...prev, { title: id + response.data.title, id: id, complete: false }])
    }

    const onPageChange = (e) => {
        if (e.target.value < 50) {
            setPageCount(e.target.value)
        }
    }

    const startScraping = async (dataPoint) => {
        const body = {
            id: dataPoint.id,
            title: dataPoint.title,
            pageCount: pageCount
        }
        const response = await axios.post('/scrape', body)
        console.log(response);
        setAllData(prev => prev.map(obj => {
            if (obj.id === dataPoint.id) {
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
    }

    const downloadItem = async (title) => {
    // need to connect with backend
        const response = await axios.get('/download')
      }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
            <button onClick={addItem}>Add item</button>
            <input type='number' value={pageCount} onChange={onPageChange}></input>
            <ul>
                {Array.isArray(allData) && allData.length > 0 && allData.map(dataPoint => {
                    return (
                        <li key={dataPoint.title}>
                            <p>{dataPoint.title.slice(10)}</p>
                            {!dataPoint.complete && <button onClick={() => startScraping(dataPoint)}>Click to scrape</button>}
                            {!dataPoint.complete && <button onClick={() => removeItem(dataPoint.title)}>Click to remove</button>}
                            {dataPoint.complete && <button onClick={() => deleteItem(dataPoint.title)}>Click to delete</button>}
                            {dataPoint.complete && <button onClick={() => downloadItem(dataPoint.title)}>Download CSV</button>}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}


export default Test;