import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Kanban from './Kanban';

const Board = () => {
    return (
        <div className='container'>
            <Navbar />
            <Sidebar />
            <Kanban />
        </div>
    );
};

export default Board;