import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { isThisWeek } from 'date-fns';
import { fetchAllIssues } from '../api/UserAPI';
import SearchIcon from './icons/Search';
import RecentIssue from './RecentIssue';
import { Loader } from 'semantic-ui-react'
import { useAuth } from '../useAuth';

const SearchIssuePane = ({ isDisplayed, setIsDisplayed }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [textFilter, setTextFilter] = useState('');
    const [issues, setIssues] = useState(null);
    const [searching, setSearching] = useState(false);
    const [filteredIssues, setFilteredIssues] = useState(null);

    const onChange = (e) => {
        const val = e.target.value;
        setTextFilter(val);
        setSearching(val.length > 0);
    };
    const onClose = () => {
        setTextFilter('');
        setIsDisplayed(false);
        setSearching(false);
    };

    useEffect(() => {
        const fetchRecentIssues = async () => {
            try {
                const data = await fetchAllIssues();
                setIssues(data);
            } catch (error) {
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };
        if (isDisplayed) {
            fetchRecentIssues();
        }
    }, [isDisplayed]);

    useEffect(() => {
        let timeoutId = 0;
        if (searching) {
            timeoutId = setTimeout(() => {
                let filtered = issues;
                if (textFilter.length) {
                    filtered = issues.filter((fi) => {
                        return (fi.title.toLowerCase().includes(textFilter.toLowerCase()) || fi.description.toLowerCase().includes(textFilter.toLowerCase()));
                    });
                }
                setFilteredIssues(filtered);
                setSearching(false);
            }, 1000);
        }
        return () => clearTimeout(timeoutId);
    }, [textFilter]);

    return (
        <div>
            <SlidingPane
            isOpen={isDisplayed}
            from='left'
            hideHeader={true}
            width='600px'
            className='searchPane'
            onRequestClose={onClose}
          >
            <form>
                <div id='search-pane-input-container'>
                    <div id='search-pane-icon-container'>
                        <SearchIcon w='20' h='20' />
                    </div>
                    <input id='search-pane-input'
                           type='text'
                           placeholder='Search isues by summary, description...'
                           value={textFilter}
                           onChange={onChange}
                           autoComplete='off'
                    />
                </div>
                {
                    searching ? <Loader active inline='centered' size='huge'>Looking for matches...</Loader> :
                    <div>
                        {
                            (textFilter.length === 0) ?
                            <div>
                                <div id='recent-issues-container'>
                                    RECENT ISSUES
                                </div>
                                <div>
                                    {issues &&
                                    issues.filter((i) => isThisWeek(new Date(i.last_updated_at))).map((i) => <RecentIssue key={i.issue_id} data={i} onIssueClick={onClose}/>)
                                    }
                                </div>
                            </div>
                            :
                            <div>
                                <div id='recent-issues-container'>
                                    {(filteredIssues.length > 0) ? <div>MATCHES</div> : <div>NO MATCHES FOUND   :(</div>}
                                </div>
                                <div>
                                    {filteredIssues &&
                                    filteredIssues.map((i) => <RecentIssue key={i.issue_id} data={i} onIssueClick={onClose}/>)
                                    }
                                </div>
                            </div>
                        }
                    </div>
                }
            </form>
          </SlidingPane>
        </div>
    );
};

export default SearchIssuePane;