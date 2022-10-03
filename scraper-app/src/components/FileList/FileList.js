import React from "react";

const FileList = ({allData, changeCheck, deleteItem, downloadItem}) => {

    return ( 
        <ul>
        {Array.isArray(allData) && allData.length > 0 && allData.map(dataPoint => {
            return (
                <li key={dataPoint.title}>
                    <input type='checkbox' onChange={() => changeCheck(dataPoint.title)} disabled={!dataPoint.complete}></input>
                    {dataPoint.title.slice(10, 35)}...
                    <a href={`http://www.amazon.com/dp/${dataPoint.id}`} rel='noreferrer' target='_blank'>Link</a>
                    {dataPoint.complete && <button onClick={() => deleteItem(dataPoint.title)}>Click to delete</button>}
                    {dataPoint.complete && <button onClick={() => downloadItem(dataPoint.title)}>Download CSV</button>}
                </li>
            )
        })}
    </ul>
     );
}
export default FileList;