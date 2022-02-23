import React from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <section className='landing'>
            <h1 >JIRA</h1>

            <div className='landing-box'>
                <h2>Error: Page Not Found</h2>
                <p className='underline-hover'
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    Click here to return to home page.
                </p>
            </div>
        </section>

    );
};

export default NotFound;