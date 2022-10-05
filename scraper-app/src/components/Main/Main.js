import React, { useState, useEffect } from "react";
import axios from 'axios';
import Graph from "../Graph/Graph";
import Logout from "../Logout/Logout"
import InputFields from '../InputFields/InputFields'
import FileList from "../FileList/FileList";
import Header from "../Header/Header";
import './Main.css';



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

    const initializeData = async () => {
        const directory = JSON.parse(localStorage.getItem('directory'))
        const url = '/all_objects';
        const response = await axios.get(`${url}?directory=${directory}`)
        // console.log(response.data);
        setAllData(response.data.data)
    }

    const addItem = async () => {
        const id = getID();
        const directory = JSON.parse(localStorage.getItem('directory'))
        const body = {
            id: id,
        }
        const response = await axios.post('/add', body)
        console.log(response);
        // add to all data but without scraped flag
        setAllData(prev => [...prev, { title: directory + id + response.data.title + '.csv', id: id, complete: false, src: response.data.src}])
        startScraping({id: id, title: directory + id + response.data.title, src: response.data.src})
    }

    // const onPageChange = (e) => {
    //     if (e.target.value < 50) {
    //         setPageCount(e.target.value)
    //     }
    // }

    const startScraping = async ({id, title, src}) => {
        const body = {
            id: id,
            title: title,
            pageCount: pageCount,
            src: src
            // directory: JSON.parse(localStorage.getItem('directory'))
        }
        const response = await axios.post('/scrape', body)
        console.log(response);
        // should I call initializeData() again after scraping is finished?  That way server controls then data list
        setAllData(prev => prev.map(obj => {
            if (obj.id === id) {
                return { ...obj, complete: true };
            }
            return obj;
        }))
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
        console.log(response);
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
        initializeData();
    }, []);

    useEffect(() => {
        updateCharts()
    }, [selection]);


    return (
        <div className='App'>
            <Header removeToken={removeToken} />
            {/* Replace with Input component */}
            <InputFields webPage={webPage} setWebPage={setWebPage} addItem={addItem} pageCount={pageCount} setPageCount={setPageCount} />
            <div className='data-wrapper'>
                <FileList allData={allData} selection={selection} setSelection={setSelection} changeCheck={changeCheck} deleteItem={deleteItem} downloadItem={downloadItem} />
                {csvData.length > 0 && <Graph data={csvData} />}
            </div>
        </div>
    );
}


export default App;