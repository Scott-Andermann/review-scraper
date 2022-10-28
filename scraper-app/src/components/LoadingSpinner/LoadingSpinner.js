import React from 'react';
import './LoadingSpinner.css';
const LoadingSpinner = ({ invert }) => {

    if (invert) {document.documentElement.style.setProperty('--primary-color', 'rgb(63, 156, 149)')}
    else {document.documentElement.style.setProperty('--primary-color', '#fff')}

    return (
    <div class="lds-roller">
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
        <div className={invert ? 'invert' : ''}></div>
    </div>);
}

export default LoadingSpinner;