import React, { useState } from "react";

const AccountRecovery = () => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return ( 
    <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
            <label>
                <p>Enter email to receive a password reset link</p>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <div>
                <button type='submit'>Submit</button>
            </div>
        </form>
    </div> );
}
 
export default AccountRecovery;