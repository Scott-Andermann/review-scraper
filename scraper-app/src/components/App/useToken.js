// custom hook for user login

import { useState } from "react";

const useToken = () => {
    const getToken = () => {
        // const tokenString = sessionStorage.getItem('token')
        const tokenString = localStorage.getItem('token')
        const userToken = JSON.parse(tokenString);
        if (userToken !== null) 
            if (userToken === 'OK')
                // console.log(userToken.token);
                return userToken
    }
    console.log('setting token');
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        // sessionStorage.setItem('token', JSON.stringify(userToken))
        localStorage.setItem('token', JSON.stringify(userToken.token))
        localStorage.setItem('directory', JSON.stringify(userToken.directory))
        setToken(userToken.token)
    }

    const removeToken = () => {
        localStorage.removeItem('token')
        setToken(null)
    }
    
    return {
        removeToken: removeToken,
        saveToken: saveToken,
        token
    }
}
 
export default useToken;