import React from "react";
import Login from "../Login/Login";
import Main from '../Main/Main';
import './App.css';

import useToken from "./useToken";


function App() {
    
    const {token, removeToken, saveToken} = useToken();

    // const {token, removeToken, saveToken} = useToken();

    if (token === 'OK')
        return <Main removeToken={removeToken}/>

    return <Login saveToken={saveToken} />

}

export default App;
