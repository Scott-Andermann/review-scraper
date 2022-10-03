import React, { useState } from "react";
import axios from "axios";

const AddUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');


    const onSubmit = async (e) => {
        e.preventDefault();
        //need to validate email
        if (password === password2) {
            // create bucket and move to dashboard
            // need to hash password before sending
            const body = {
                username: email,
                password: password
            }
            const response = await axios.post('/add_user', body)
            console.log(response);
        } else {
            // change this to visual highlight
            alert('Passwords do not match')

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
                    <p>Validate Password:</p>
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