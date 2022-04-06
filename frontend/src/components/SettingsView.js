import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Settings from './Settings';

const SettingsView = () => {
    return (
        <div className='container'>
            <Navbar />
            <Sidebar />
            <Settings />
        </div>
    );
};

export default SettingsView;