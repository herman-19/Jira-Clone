import React from 'react';
import Register from '../components/Register';

const Landing = () => {
    return (
        <section className='landing'>
            <h1 >JIRA</h1>
            <div className='landing-box'>
                <Register />
            </div>
        </section>
    );
};

export default Landing;