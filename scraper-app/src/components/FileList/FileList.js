import React from "react";
import './FileList.css';

const FileList = ({ allData, changeCheck, deleteItem, downloadItem, selection }) => {

    const allCheck = () => {
        console.log('add all titles to analysis');
        // setSelection to include all titles from allData
    }

    return (
            <table className="styled-table">
                <thead>
                    <th>
                        <input type='checkbox' onChange={allCheck}></input>
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
                                    <input type='checkbox' onChange={() => changeCheck(dataPoint.title)} disabled={!dataPoint.complete} defaultChecked={selection.includes(dataPoint.title) && true}></input>
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