import React from "react";

const FileList = ({allData, changeCheck, deleteItem, downloadItem}) => {

    return ( 
        <ul>
        {Array.isArray(allData) && allData.length > 0 && allData.map(dataPoint => {
            return (
                <li key={dataPoint.title}>
                    <input type='checkbox' onChange={() => changeCheck(dataPoint.title)} disabled={!dataPoint.complete}></input>
                    {dataPoint.src && <img src={dataPoint.src} alt={dataPoint.title.slice(31, 51) + '... image'} />}
                    {dataPoint.title.slice(31, 55)}...
                    <a href={`http://www.amazon.com/dp/${dataPoint.id}`} rel='noopener noreferrer' target='_blank'>Link</a>
                    {dataPoint.complete && <button onClick={() => deleteItem(dataPoint.title)}>Click to delete</button>}
                    {dataPoint.complete && <button onClick={() => downloadItem(dataPoint.title)}>Download CSV</button>}
                </li>
            )
        })}
    </ul>
     );
}
export default FileList;