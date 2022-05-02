import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { isThisWeek } from 'date-fns';
import SearchIcon from './icons/Search';
import GithubIcon from './icons/Github';
import Columns from './Columns';
import { fetchAllIssues, fetchAllIssueAssignees} from '../api/UserAPI';
import { useAuth } from '../useAuth';

const Kanban = ({ name }) => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [textFilter, setTextFilter] = useState('');

    const [textFilterEnabled, setTextFilterEnabled] = useState(false);
    const [myIssuesSelected, setmyIssuesSelected] = useState(false);
    const [recentlyUpdatedSelected, setMyRecentlyUpdatedSelected] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();
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
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };
        fetchIssues();
    }, []);

    const onChange = (e) => {
        const val = e.target.value;
        setTextFilter(val);
        updateFilteredIssues(val, myIssuesSelected, recentlyUpdatedSelected);
    };

    const onMyIssuesClick = (e) => {
        let myIssues = myIssuesSelected;
        updateFilteredIssues(textFilter, !myIssues, recentlyUpdatedSelected);
        if (myIssues) {
            e.target.style.backgroundColor = 'inherit';
        } else {
            e.target.style.backgroundColor = '#a7cff5';
        }
        setmyIssuesSelected(!myIssues);
    };

    const onRecentlyUpdatedClick = (e) => {
        let recent   = recentlyUpdatedSelected;
        updateFilteredIssues(textFilter, myIssuesSelected, !recent);
        if (recent) {
            e.target.style.backgroundColor = 'inherit';
        } else {
            e.target.style.backgroundColor = '#a7cff5';
        }
        setMyRecentlyUpdatedSelected(!recent);
    };

    const clearFilters = () => {
        setTextFilterEnabled(false);
        setTextFilter('');
        setmyIssuesSelected(false);
        setMyRecentlyUpdatedSelected(false);
        let element = document.getElementById('filter-button-1');
        ReactDOM.findDOMNode(element).style.backgroundColor = 'inherit';
        element = document.getElementById('filter-button-2');
        ReactDOM.findDOMNode(element).style.backgroundColor = 'inherit';
    };

    const filterByAssigneeIdHelper = (list, userId) => {
        return list.filter((i) => {
            if (i.assignee_ids) {
                return i.assignee_ids.includes(userId);
            }
            return false;
        });
    };

    const updateFilteredIssues = (text, myIssues, recent) => {
        // Layer filters.
        if (text.length === 0 && !myIssues && !recent) {
            // No filter.
            setTextFilterEnabled(false);
        } else {
            let filtered = issues;
            if (text.length) {
                filtered = issues.filter((fi) => fi.title.toLowerCase().includes(text.toLowerCase()));
            }
            if (myIssues) {
                filtered = filterByAssigneeIdHelper(filtered, auth.myUserId);
            }
            if (recent) {
                filtered = filtered.filter((fi) => isThisWeek(new Date(fi.last_updated_at)));
            }
            setFilteredIssues(filtered);
            setTextFilterEnabled(true);
        }
    };
    const onLogoutClick = async () => {
        await auth.logout(() => {
            navigate('/');
        });
    };

    return (
        <div id='kanban-board'>
            <div id='kanban-path'>
                <span>Projects</span>
                <span>/</span>
                <span>{name}</span>
                <span>/</span>
                <span>Kanban Board</span>
            </div>
            <div id='kanban-header'>
                <p>Kanban Board</p>
                <div>
                    <a target='_blank' rel='noopener noreferrer' href='https://github.com/herman-19/Jira-Clone'>
                        <button><GithubIcon />Github Repo</button>
                    </a >
                    <button onClick={onLogoutClick}>Log Out</button>
                </div>
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
                <button id='filter-button-1' onClick={onMyIssuesClick}>Only My Issues</button>
                <button id='filter-button-2' onClick={onRecentlyUpdatedClick}>Recently Updated</button>
                { textFilterEnabled && <div onClick={clearFilters} id='clear-all-button'>Clear All </div>}
            </div>
            <Columns issues={textFilterEnabled ? filteredIssues : issues} />
        </div >
    );
};

export default Kanban;