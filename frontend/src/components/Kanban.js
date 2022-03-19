import React from 'react';
import SearchIcon from './icons/Search';
import GithubIcon from './icons/Github';
import Columns from './Columns';

const Kanban = () => {
    return (
        <div id='kanban-board'>
            <div id='kanban-path'>
                <span>Projects</span>
                <span>/</span>
                <span>Jira Clone</span>
                <span>/</span>
                <span>Kanban Board</span>
            </div>
            <div id='kanban-header'>
                <p>Kanban Board</p>
                <a target='_blank' rel='noopener noreferrer' href='https://github.com/herman-19/Jira-Clone'>
                    <button><GithubIcon />Github Repo</button></a >
            </div>
            <div id='kanban-filters'>
                <form>
                    <div id='input-container'>
                        <div id='icon-container'>
                            <SearchIcon w='14' h='14' />
                        </div>
                        <input type='text' />
                    </div>
                </form>
                <div id='filter-user-icons-container'>
                    <div className='filter-user-icon-container'>
                        <div className='filter-user-icon' />
                        <div className='filter-user-icon' />
                    </div>
                </div>
                <button >Only My Issues</button>
                <button>Ignore Resolved</button>
            </div>
            <Columns />
        </div >
    );
};

export default Kanban;