import React, { useState } from "react";
import axios from "axios";
import {sha256} from 'js-sha256'
import { Navigate, useNavigate } from "react-router-dom";

const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    
    const navigate = useNavigate();

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

        const validatePasswords = () => {
            if (password === password2) {
                if (password.length >= 6) {
                    return true
                } else {
                    alert('Please enter a password of at least 6 characters');
                }
            } else {
                alert('Passwords do not match')
            }
        }
        
        if (validatePasswords() && validateEmail(email)) {
            const body = {
                username: email,
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
                    <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>
                    <p>Password:</p>
                    <input value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <label>
                    <p>Enter Password Again:</p>
                    <input value={password2} onChange={(e) => setPassword2(e.target.value)}></input>
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