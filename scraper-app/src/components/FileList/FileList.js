import React from "react";
import './FileList.css';

const FileList = ({ allData, changeCheck, deleteItem, downloadItem }) => {

    const allCheck = () => {
        console.log('add all titles to analysis');
    }

    return (
            <table className="styled-table">
                <thead>
                    <th>
                        <input type='checkbox' onChange={allCheck}></input>
                    </ th>
                    <th></ th>
                    <th>Item</ th>
                    <th>Amazon Page</ th>
                    <th>Action</ th>
                </thead>
                <tbody>
                    {Array.isArray(allData) && allData.length > 0 && allData.map(dataPoint => {
                        return (
                            <tr key={dataPoint.title}>
                                <td>
                                    <input type='checkbox' onChange={() => changeCheck(dataPoint.title)} disabled={!dataPoint.complete}></input>
                                </td>
                                <td>
                                    {dataPoint.src &&
                                        <div className='thumbnail-wrapper'>
                                            <img className='thumbnail' src={dataPoint.src} alt={dataPoint.title.slice(31, 51) + '... image'} />
                                        </div>}
                                </td>
                                <td>
                                    <p>
                                        {dataPoint.title.slice(31, 55)}...
                                    </p>
                                </td>
                                <td>
                                    <a href={`http://www.amazon.com/dp/${dataPoint.id}`} rel='noopener noreferrer' target='_blank'>Link</a>
                                </td>
                                <td>
                                    {dataPoint.complete && <button onClick={() => deleteItem(dataPoint.title)}>Delete</button>}
                                    {dataPoint.complete && <button onClick={() => downloadItem(dataPoint.title)}>Download</button>}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
    );
}
export default FileList;