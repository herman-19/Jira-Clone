import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Kanban } from './Kanban';

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