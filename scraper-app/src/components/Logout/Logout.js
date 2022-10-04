import React from "react";
import LogoutIcon from "../../Images/LogoutIcon";
import './Logout.css';

const Logout = ({removeToken}) => {

    const handleClick = () => {
        removeToken();
    }

    return ( 
        <div>
            
            <button className="logout-button" onClick={handleClick}>
                <LogoutIcon />
                <p>Logout</p>
            </button>
        </div>
     );
}
 
export default Logout;