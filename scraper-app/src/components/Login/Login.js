import React, {useState} from "react";
import { Link } from "react-router-dom";
import {sha256} from 'js-sha256';
import './Login.css';

const url = '/login'

const loginUser = async (credentials) => {
    // console.log(credentials);
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)})
    const data = await response.json()
    return data
}

const Login = ({saveToken}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // need to hash the username and password before sending to protect users
        const token = await loginUser({
            username: username, password: sha256(password)
        })
        saveToken(token)
    }

    return ( 
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type='submit'>Submit</button>
                </div>
            </form>
            <Link to='/create_account'>Create new account</Link>
            <Link to='/account_recovery'>Forgot password?</Link>
        </div>
     );
}
 
export default Login;