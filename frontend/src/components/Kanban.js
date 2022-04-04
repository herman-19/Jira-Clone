import React, { useState, useEffect } from 'react';
import SearchIcon from './icons/Search';
import GithubIcon from './icons/Github';
import Columns from './Columns';
import { fetchAllIssues, fetchAllIssueAssignees} from '../api/UserAPI';
import { useAuth } from '../useAuth';

const Kanban = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [textFilter, setTextFilter] = useState('');

    const [textFilterEnabled, setTextFilterEnabled] = useState(false);
    const [myIssuesSelected, setmyIssuesSelected] = useState(false);

    const auth = useAuth();
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const allIssues = await fetchAllIssues();
                const issueAssignees = await fetchAllIssueAssignees();
                for (let ia of issueAssignees) {
                    // Find corresponding issue in allIssues and add list of assignees to object.
                    for (let issue of allIssues) {
                        if (issue.issue_id === ia.issue_id) {
                            issue.assignee_ids = ia.person_id; // person_id is list of ids
                            break;
                        }
                    }
                }
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
        updateFilteredIssues(val, myIssuesSelected);
    };

    const onMyIssuesClick = (e) => {
        let myIssues = myIssuesSelected;
        let text = textFilter;
        updateFilteredIssues(text, !myIssues);
        if (myIssues) {
            e.target.style.backgroundColor = 'inherit';
        } else {
            e.target.style.backgroundColor = '#a7cff5';
        }
        setmyIssuesSelected(!myIssues);
    };

    const filterByAssigneeIdHelper = (list, userId) => {
        return list.filter((i) => {
            if (i.assignee_ids) {
                return i.assignee_ids.includes(userId);
            }
            return false;
        });
    };

    const updateFilteredIssues = (text, myIssues) => {
        // Zero to two filters can be enabled: text and/or my issues only.
        if (text.length && !myIssues) {
            // Iterate issues and find matches.
            const filtered = issues.filter((fi) => fi.title.toLowerCase().includes(text.toLowerCase()));
            setFilteredIssues(filtered);
            setTextFilterEnabled(true);
        } else if (text.length && myIssues) {
            let filtered = issues.filter((fi) => fi.title.toLowerCase().includes(text.toLowerCase()));
            filtered = filterByAssigneeIdHelper(filtered, auth.myUserId);
            setFilteredIssues(filtered);
            setTextFilterEnabled(true);
        } else if (text.length === 0 && myIssues) {
            // My issues (no text filter).
            const filtered = filterByAssigneeIdHelper(issues, auth.myUserId);
            setFilteredIssues(filtered);
            setTextFilterEnabled(true);
        } else if (text.length === 0 && !myIssues) {
            // No filter.
            setTextFilterEnabled(false);
        }
    }

    const handleButtonClick = (e) => {
        e.target.style.backgroundColor = "#a7cff5"
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
                <button onClick={onMyIssuesClick}>Only My Issues</button>
                <button>Ignore Resolved</button>
            </div>
            <Columns issues={textFilterEnabled ? filteredIssues : issues} />
        </div >
    );
};

export default Kanban;