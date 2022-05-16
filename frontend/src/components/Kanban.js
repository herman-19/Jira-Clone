import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { isThisWeek } from 'date-fns';
import SearchIcon from './icons/Search';
import GithubIcon from './icons/Github';
import Columns from './Columns';
import { fetchAllIssues, fetchAllIssueAssignees, fetchUsers, fetchListImagesSignedUrls } from '../api/UserAPI';
import { useAuth } from '../useAuth';

const kanbanContext = React.createContext();

const Kanban = ({ name }) => {
    const [issues, setIssues] = useState([]);
    const [users, setUsers] = useState(null);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [textFilter, setTextFilter] = useState('');

    const [textFilterEnabled, setTextFilterEnabled] = useState(false);
    const [myIssuesSelected, setmyIssuesSelected] = useState(false);
    const [recentlyUpdatedSelected, setMyRecentlyUpdatedSelected] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const responses = await Promise.all([fetchAllIssues(), fetchAllIssueAssignees()]);
                const allIssues = responses[0];
                const issueAssignees = responses[1];
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
        const getUsers = async () => {
            const users = await fetchUsers();
            const { urlsInfo } = await fetchListImagesSignedUrls();
            for (let urlInfo of urlsInfo) {
                const idx = users.findIndex((user) => user.person_id === parseInt(urlInfo.userId));
                if (idx !== -1) {
                    users[idx].url = urlInfo.url;
                }
            }
            setUsers(users);
        };
        fetchIssues();
        getUsers();
    }, [auth, navigate]);

    const onChange = (e) => {
        const val = e.target.value;
        setTextFilter(val);
        updateFilteredIssues(val, myIssuesSelected, recentlyUpdatedSelected, selectedUsers);
    };

    const onMyIssuesClick = (e) => {
        let myIssues = myIssuesSelected;
        updateFilteredIssues(textFilter, !myIssues, recentlyUpdatedSelected, selectedUsers);
        if (myIssues) {
            e.target.style.backgroundColor = 'inherit';
        } else {
            e.target.style.backgroundColor = '#a7cff5';
        }
        setmyIssuesSelected(!myIssues);
    };

    const onRecentlyUpdatedClick = (e) => {
        let recent   = recentlyUpdatedSelected;
        updateFilteredIssues(textFilter, myIssuesSelected, !recent, selectedUsers);
        if (recent) {
            e.target.style.backgroundColor = 'inherit';
        } else {
            e.target.style.backgroundColor = '#a7cff5';
        }
        setMyRecentlyUpdatedSelected(!recent);
    };

    const onUserIconClick = (e, userId) => {
        e.target.classList.toggle('filter-user-icon');
        e.target.classList.toggle('filter-user-icon-selected');
        let idx = selectedUsers.indexOf(userId);
        let selUsers = [];
        if (idx !== -1) {
            // Remove from list of selected users.
            selUsers = selectedUsers.filter((id) => id !== userId);
            setSelectedUsers(selUsers);
        } else {
            // Add to list of selected users.
            selUsers = [...selectedUsers, userId];
            setSelectedUsers(oldArray => [...oldArray, userId] );
        }
        updateFilteredIssues(textFilter, myIssuesSelected, recentlyUpdatedSelected, selUsers);
    };

    const clearFilters = () => {
        setTextFilterEnabled(false);
        setTextFilter('');
        setmyIssuesSelected(false);
        setMyRecentlyUpdatedSelected(false);
        setSelectedUsers([]);

        //  Reset styles of filter buttons used.
        let element = document.getElementById('filter-button-1');
        ReactDOM.findDOMNode(element).style.backgroundColor = 'inherit';
        element = document.getElementById('filter-button-2');
        ReactDOM.findDOMNode(element).style.backgroundColor = 'inherit';

        // Reset style of user icons to that of unselected.
        let userIcons = document.getElementsByClassName('filter-user-icon-selected');
        while (userIcons.length) {
            userIcons[0].classList.toggle('filter-user-icon');
            userIcons[0].classList.toggle('filter-user-icon-selected');
        }
    };

    const filterByAssigneeIdHelper = (list, userId) => {
        return list.filter((i) => {
            if (i.assignee_ids) {
                return i.assignee_ids.includes(userId);
            }
            return false;
        });
    };

    const updateFilteredIssues = (text, myIssues, recent, issueAssignees) => {
        // Layer filters.
        if (text.length === 0 && !myIssues && !recent && issueAssignees.length === 0) {
            // No filter.
            setTextFilterEnabled(false);
        } else {
            let filtered = issues;
            if (text.length) {
                filtered = issues.filter((fi) => fi.title.toLowerCase().includes(text.toLowerCase()));
            }
            if (issueAssignees.length) {
                // If an issue contains at least one of the selected assignees, display it.
                filtered = filtered.filter((fi) => {
                    if (fi.assignee_ids) {
                        let displayIssue = false;
                        for (let assignee of issueAssignees) {
                            if (fi.assignee_ids.includes(assignee)) {
                                displayIssue = true;
                                break;
                            }
                        }
                        if (displayIssue) {
                            return true;
                        }
                    }
                    return false;
                });
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
        <kanbanContext.Provider value={users}>
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
                            {
                                users && users.map((u, index) =>
                                <div className='filter-user-icon tooltip' key={index} onClick={(e) => onUserIconClick(e, u.person_id)} style={{backgroundImage:`url(${u.url})`}}>
                                    <span className='tooltiptext-user-icon'>{u.name}</span>
                                </div>)
                            }
                        </div>
                    </div>
                    <button id='filter-button-1' onClick={onMyIssuesClick}>Only My Issues</button>
                    <button id='filter-button-2' onClick={onRecentlyUpdatedClick}>Recently Updated</button>
                    { textFilterEnabled && <div onClick={clearFilters} id='clear-all-button'>Clear All </div>}
                </div>
                <Columns issues={textFilterEnabled ? filteredIssues : issues} />
            </div >
        </kanbanContext.Provider>
    );
};

export {
    Kanban,
    kanbanContext
};