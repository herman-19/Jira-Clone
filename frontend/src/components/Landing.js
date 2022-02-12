import React, { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';

const Landing = () => {
    const [loginDisplayed, setLoginDisplayed] = useState(true);
    return (
        <section className='landing'>
            <h1 >JIRA</h1>
            <div className='landing-box'>
                {loginDisplayed
                    ? <Login loginDisplayed={setLoginDisplayed} />
                    : <Register loginDisplayed={setLoginDisplayed} />
                }
            </div>
        </section>
    );
};

export default Landing;