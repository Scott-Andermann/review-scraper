import React from "react";
import './InputFields.css';

const Input = ({webPage, setWebPage, addItem, setPageCount}) => {
    return ( 
        <div className='input-wrapper'>
            {/* <h4>Enter URL of item:</h4> */}
            <input className='url-field' value={webPage} onChange={(e) => setWebPage(e.target.value)} placeholder='Enter Amazon Product URL'></input>
            <div className='select-wrapper'>
                <h4 className='helper'>Select level of analysis</h4>
                <select className='select-analysis' name='analysis-level' onChange={(e) => setPageCount(e.target.value)}>
                    <option value={5}>Preview</option>
                    <option value={20}>Mid-Level</option>
                    <option value={50}>Deep Dive</option>
                </select>
            </div>
            <button className='add-item-button' onClick={addItem}>Add item</button>
            {/* <input type='number' value={pageCount} onChange={onPageChange}></input> */}
        </div>
     );
}
 
export default Input;