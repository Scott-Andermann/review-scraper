import React from "react";

const Logout = ({removeToken}) => {

    const handleClick = () => {
        removeToken();
    }

    return ( 
        <div>
            <button onClick={handleClick}>Logout</button>
        </div>
     );
}
 
export default Logout;