import React, { useState, useEffect } from "react";
import axios from "axios";
import {sha256} from 'js-sha256'
import { useNavigate, Link } from "react-router-dom";
import './AddUser.css';
import '../Login/Login.css';

const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [valid, setValid] = useState(false);
    const [created, setCreated] = useState(false);
    const [blank, setBlank] = useState(true);
    
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
        setBlank(false)
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
            if (/^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$/.test(mail)) {
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
                setCreated(true)
                // alert('Account created, please log in')
                // navigate('/')
            } else {
                alert(response.data)
            }
        }
    }

    useEffect(() => {
        if (created) {
            setTimeout(() => {
                navigate('/')
            }, 1500)
        }
    }, [created]);

    return (
        <div className='login-wrapper'>
            <div className='login-container'>
                <div className="header-container">
                    <h1>Create Account</h1>
                </div>
                <form className='login-form' onSubmit={onSubmit}>
                    <div className='input-label'>
                        <input className='input-field' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your Email'></input>
                    </div>
                    <div className='input-label'>
                        <input className={`input-field ${valid ? 'valid' : blank ? '' : 'invalid'}`} name='password' type='password' value={password} onChange={onChange} placeholder='Password'></input>
                    </div>
                    <div className='input-label'>
                        <input className={`input-field ${valid ? 'valid' : blank ? '' : 'invalid'}`} name='password2' type='password' value={password2} onChange={onChange} placeholder='Password'></input>
                    </div>
                    <div className='submit-wrapper'>
                        <button className='submit-button' type='submit'>Create Account</button>
                    </div>
                    <div className='return-wrapper'>
                        <Link className='login-link return-link' to='/'>Already have an account? Log in</Link>
                    </div>
                </form>
                {created ? 
                <div className='add-user-modal'>
                    <h3 style={{marginBottom: 'auto'}}>Account created successfully</h3>
                    <p>Returning to login page</p>
                    <Link className="login-link" to='/'>Click here if you are not automatically redirected</Link>
                </div> : <></>}
            </div>
        </div>
    );
}

export default AddUser;