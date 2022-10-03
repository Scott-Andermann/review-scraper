import React, {useState} from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Preferences from '../Preferences/Preferences';
import Login from '../Login/Login';
import Logout from '../../Logout/Logout';

import useToken from './useToken';
// Store token in session storage - will persist on page refresh but not new tabs

function App() {
  // Store token in app memory - does not persist across tabs, refreshes, etc.
  // const [token, setToken] = useState(null);
  // console.log(token);

  // call custom useToken hook
  const {token, removeToken, saveToken} = useToken();

  if (!token) {
    return <Login setToken={saveToken} />
  }


  return (
    <div className="wrapper">
      <h1>Application</h1>
      <Logout removeToken={removeToken} />
      <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
              <li>
                <Link to='/preferences'>Preferences</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path='/' element={<h2>Home</h2>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/preferences' element={<Preferences />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
