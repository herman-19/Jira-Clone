import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Kanban from './Kanban';
import { fetchProjectInfo } from '../api/UserAPI';

const Board = () => {
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
            <Kanban name={name} />
        </div>
    );
};

export default Board;