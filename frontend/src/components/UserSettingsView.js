import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import UserSettings from './UserSettings';

const UserSettingsView = ({ projectName, projectCategory }) => {
    return (
        <div className='container'>
            <Navbar />
            <Sidebar name={projectName} category={projectCategory}/>
            <UserSettings pathName={projectName}/>
        </div>
    );
};

export default UserSettingsView;