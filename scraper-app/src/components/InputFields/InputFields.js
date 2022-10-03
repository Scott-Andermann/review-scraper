import React from "react";

const Input = ({webPage, setWebPage, addItem, pageCount, onPageChange}) => {
    return ( 
        <div>
            <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
            <button onClick={addItem}>Add item</button>
            <h4>Enter number of pages to scrape (max 50)</h4>
            <input type='number' value={pageCount} onChange={onPageChange}></input>
        </div>
     );
}
 
export default Input;