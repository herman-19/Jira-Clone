import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import Register from '../components/Register';
import Login from '../components/Login';

const Landing = () => {
    const [loginDisplayed, setLoginDisplayed] = useState(true);
    const auth = useAuth();

    return auth.loggedIn
        ? <Navigate to='/project' />
        : <section className='landing'>
            <h1 >JIRA</h1>
            <div className='landing-box'>
                {loginDisplayed
                    ? <Login loginDisplayed={setLoginDisplayed} />
                    : <Register loginDisplayed={setLoginDisplayed} />
                }
            </div>
        </section>;
};

export default Landing;