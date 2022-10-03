import React, {useState} from "react";
import './Login.css';

const url = '/login'

const loginUser = async (credentials) => {
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)})
    const data = await response.json()
    return data
}

const Login = ({setToken}) => {
    const [username, setUsername] = useState('username');
    const [password, setPassword] = useState('password');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser({
            username: username, password: password
        })
        setToken(token)
    }

    return ( 
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
     );
}
 
export default Login;