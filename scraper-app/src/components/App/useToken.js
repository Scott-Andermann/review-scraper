// custom hook for user login

import { useState } from "react";

const useToken = () => {
    const getToken = () => {
        // const tokenString = sessionStorage.getItem('token')
        const tokenString = localStorage.getItem('token')
        const userToken = JSON.parse(tokenString);
        console.log(userToken);
        if (userToken !== null) return userToken.token
    }
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        // sessionStorage.setItem('token', JSON.stringify(userToken))
        localStorage.setItem('token', JSON.stringify(userToken))
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