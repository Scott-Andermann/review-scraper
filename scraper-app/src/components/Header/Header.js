import React from 'react';
import Logout from '../Logout/Logout';
import './Header.css'

const Header = ({removeToken}) => {
    return ( 
        <div className='header-wrapper'>
            <header className='main-header'>
                <h1 className='heading-text'>Scrape it off</h1>
                <nav>
                    <Logout removeToken={removeToken}/>
                </nav>
            </header>
        </div>
     );
}
 
export default Header;