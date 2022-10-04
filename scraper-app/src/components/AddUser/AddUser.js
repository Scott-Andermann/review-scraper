import React, { useState } from "react";
import axios from "axios";
import {sha256} from 'js-sha256'
import { useNavigate } from "react-router-dom";
import './AddUser.css';

const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [valid, setValid] = useState(false);
    
    const navigate = useNavigate();

    const validatePasswords = (pw, pw2) => {
        if (pw === pw2) {
            if (pw.length >= 6) {
                setValid(true)
                return true
            } else {
                // alert('Please enter a password of at least 6 characters');
                setValid(false)
                return false;
            }
        } else {
            // alert('Passwords do not match');
            setValid(false)
            return false;
        }
    }

    const onChange = (e) => {
        if (e.target.name === 'password'){
            validatePasswords(e.target.value, password2)
            setPassword(e.target.value);
        }
        else {
            validatePasswords(password, e.target.value);
            setPassword2(e.target.value);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        //need to validate email
        const validateEmail = (mail) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
                return (true)
            }
            alert("You have entered an invalid email address!")
            return (false)
        }
        
        if (validatePasswords(password, password2) && validateEmail(email)) {
            const body = {
                username: email.toLowerCase(),
                password: sha256(password)
            }
            const response = await axios.post('/add_user', body)
            if (response.data === 'success') {
                //  redirect to '/'
                navigate('/')
            } else {
                alert(response.data)
            }
        }
    }

    return (
        <div className='login-wrapper'>
            <form onSubmit={onSubmit}>
                <label>
                    <p>Email:</p>
                    <input className='login-input' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>
                    <p>Password:</p>
                    <input className={`login-input ${valid ? 'valid' : 'invalid'}`} name='password' type='password' value={password} onChange={onChange}></input>
                </label>
                <label>
                    <p>Enter Password Again:</p>
                    <input className={`login-input ${valid ? 'valid' : 'invalid'}`} name='password2' type='password' value={password2} onChange={onChange}></input>
                </label>
                <div>
                    <button type='submit'>Submit</button>
                </div>
                {/* Email, password, 2nd password */}
            </form>
        </div>
    );
}

export default AddUser;