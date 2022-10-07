import React, {useState} from "react";
import { Link } from "react-router-dom";
import {sha256} from 'js-sha256';
import './Login.css';

const url = 'https://amazonreviewscraper.herokuapp.com//login'

const loginUser = async (credentials) => {
    // console.log(credentials);
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)})
    const data = await response.json()
    return data
}

const Login = ({saveToken}) => {
    // scottandermann@gmail.com / 123123
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
            <div className="login-container">
                <div className='header-container'>
                    <h1>Log in</h1>
                </div>
                <form className='login-form' onSubmit={handleSubmit}>
                    <div className='input-label'>
                        <input className='input-field' type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Your Email' />
                    </div>
                    <div className='input-label'>
                        <input className='input-field' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    </div>

                    <div className='submit-wrapper'>
                        <button className='submit-button' type='submit'>Log In</button>
                    </div>
                </form>
                <div className="alt-actions">
                    <Link className='login-link' to='/create_account'>Create new account</Link>
                    <Link className='login-link' to='/account_recovery'>Forgot password?</Link>

                </div>
            </div>
        </div>
     );
}
 
export default Login;