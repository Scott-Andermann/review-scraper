import React, {useState} from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import './InputFields.css';

const Input = ({webPage, setWebPage, addItem, setPageCount}) => {

    const [isLoading, setIsLoading] = useState(false);

    const onClick = () => {
        setIsLoading(true);
        addItem();
    }

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
            <button className='add-item-button' onClick={onClick} disabled={!isLoading}>{isLoading ? <LoadingSpinner /> : 'Add Item'}</button>
            {/* <input type='number' value={pageCount} onChange={onPageChange}></input> */}
        </div>
     );
}
 
export default Input;