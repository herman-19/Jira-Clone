import React from 'react';

const Columns = () => {
    return (
        <div id='columns-container'>
            <div className='single-column'>
                <p>BACKLOG</p>
            </div>
            <div className='single-column'>
                <p>SELECTED FOR DEVELOPMENT</p>
            </div>
            <div className='single-column'>
                <p>IN PROGRESS</p>
            </div>
            <div className='single-column'>
                <p>DONE</p>
            </div>
        </div>
    );
};

export default Columns;