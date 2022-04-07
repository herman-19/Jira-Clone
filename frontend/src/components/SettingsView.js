import React, {useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Settings from './Settings';
import { fetchProjectInfo } from '../api/UserAPI';

const SettingsView = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const getProjectInfo = async () => {
            const info = await fetchProjectInfo();
            setName(info.name);
            setCategory(info.category);
        };
        getProjectInfo();
    }, []);

    return (
        <div className='container'>
            <Navbar />
            <Sidebar name={name} category={category}/>
            <Settings pathName={name} onNameSave={setName} onCategorySave={setCategory} />
        </div>
    );
};

export default SettingsView;