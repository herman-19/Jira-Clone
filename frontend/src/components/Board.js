import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Board = () => {
    return (
        <div className='container'>
            <Navbar />
            <Sidebar />
            <div id='strip' />
            <div id='kanban-board'>
                <h1>Kanban Board</h1>
                <p>Issues are here...</p>
            </div>
        </div>
    );
};

export default Board;