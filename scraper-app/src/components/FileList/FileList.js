import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import './FileList.css';

const FileList = ({ allData, changeCheck, deleteItem, downloadItem, selection, setSelection }) => {

    const allCheck = (e) => {
        
        // console.log(e.target);
        if (e.target.checked) {
            const titles = allData.map(element => {return element.title})
            setSelection(titles)
        } else {
            setSelection([])
        }
        // setSelection to include all titles from allData
    }

    return (
            <table className="styled-table">
                <thead>
                    <th className="check">
                        <input className='checkbox' type='checkbox' onChange={allCheck}></input>
                    </ th>
                    <th></ th>
                    <th>Item</ th>
                    <th># of Records</ th>
                    <th>Action</ th>
                </thead>
                <tbody>
                    {Array.isArray(allData) && allData.length > 0 && allData.map(dataPoint => {
                        return (
                            <tr key={dataPoint.title}>
                                <td>
                                    <input className='checkbox' type='checkbox' onChange={() => changeCheck(dataPoint.title)} disabled={!dataPoint.complete} defaultChecked={selection.includes(dataPoint.title) && true} checked={selection.includes(dataPoint.title) ? true : false}></input>
                                </td>
                                <td>
                                    {dataPoint.src &&
                                        <div className='thumbnail-wrapper'>
                                            <img className='thumbnail' src={dataPoint.src} alt={dataPoint.title.slice(31, 51) + '... image'} />
                                        </div>}
                                </td>
                                <td>
                                <a href={`http://www.amazon.com/dp/${dataPoint.id}`} rel='noopener noreferrer' target='_blank'>
                                        {dataPoint.title.slice(31, 55)}...
                                    </a>
                                </td>
                                <td>
                                    <p>{dataPoint.num}</p>
                                </td>
                                <td>
                                    {dataPoint.complete ? 
                                    // <LoadingSpinner invert={true}/>
                                    <>
                                        <button onClick={() => deleteItem(dataPoint.title)}>Delete</button>
                                        <button onClick={() => downloadItem(dataPoint.title)}>Download</button>
                                    </> 
                                    : <LoadingSpinner invert={true}/>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
    );
}
export default FileList;