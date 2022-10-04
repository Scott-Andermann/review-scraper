import React, {useEffect} from "react";
import Login from "../Login/Login";
import Main from '../Main/Main';
import './App.css';

import useToken from "./useToken";


function App() {
    
    const {token, removeToken, saveToken} = useToken();

    // this is used to bypass the login screen
    useEffect(() => {
        // saveToken('OK')
        const newToken = {'token': 'OK', 'directory': '80f7abfd5d1d69d1ca02/'};
        // localStorage.setItem('token', newToken.token);
        // localStorage.setItem('directory', newToken.directory);
        saveToken(newToken);
    }, []);
    
    // const {token, removeToken, saveToken} = useToken();

    if (token === 'OK')
        return <Main removeToken={removeToken}/>

    return <Login saveToken={saveToken} />

}

export default App;
