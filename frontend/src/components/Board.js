import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Kanban from './Kanban';
import { fetchProjectInfo } from '../api/UserAPI';

const Board = ({ projectName, projectCategory }) => {
    return (
        <div className='container'>
            <Navbar />
            <Sidebar name={projectName} category={projectCategory}/>
            <Kanban name={projectName} />
        </div>
    );
};

export default Board;