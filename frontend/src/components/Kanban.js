import React, { useState, useEffect } from 'react';
import SearchIcon from './icons/Search';
import GithubIcon from './icons/Github';
import Columns from './Columns';
import { fetchAllIssues } from '../api/UserAPI';

const Kanban = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [textFilter, setTextFilter] = useState('');
    const [filterEnabled, setFilterEnabled] = useState(false);
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const allIssues = await fetchAllIssues();
                setIssues(allIssues);
                setFilteredIssues(allIssues);
            } catch (error) {
                // TODO: Show warning.
                console.log(error);
            }
        };
        fetchIssues();
    }, []);

    const onChange = (e) => {
        const val = e.target.value;
        setTextFilter(val);

        // Filter issues based on current text in issue search bar.
        if (val.length > 0) {
            // Iterate issues and find matches.
            const filtered = issues.filter((fi) => fi.title.toLowerCase().includes(val.toLowerCase()));
            setFilteredIssues(filtered);
            setFilterEnabled(true);
        } else {
            setFilterEnabled(false);
        }
    };

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
                        <input type='text' value={textFilter} onChange={onChange} />
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
            <Columns issues={filterEnabled ? filteredIssues : issues} />
        </div >
    );
};

export default Kanban;