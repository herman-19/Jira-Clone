import React, {useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Settings from './Settings';

const SettingsView = ({ projectName, projectCategory, onNameSave, onCategorySave }) => {
    return (
        <div className='container'>
            <Navbar />
            <Sidebar name={projectName} category={projectCategory}/>
            <Settings pathName={projectName} onNameSave={onNameSave} onCategorySave={onCategorySave} />
        </div>
    );
};

export default SettingsView;