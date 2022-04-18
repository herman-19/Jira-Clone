import React, { useState, useEffect } from 'react';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { isThisWeek } from 'date-fns';
import { fetchAllIssues } from '../api/UserAPI';
import SearchIcon from './icons/Search';
import RecentIssue from './RecentIssue';

const SearchIssuePane = ({ isDisplayed, setIsDisplayed }) => {
    const [textFilter, setTextFilter] = useState('');
    const [issues, setIssues] = useState(null);

    const onChange = (e) => {
        const val = e.target.value;
        setTextFilter(val);
        // updateFilteredIssues(val, myIssuesSelected, recentlyUpdatedSelected);
    };
    const onClose = () => {
        setTextFilter('');
        setIsDisplayed(false);
    }

    useEffect(() => {
        const fetchRecentIssues = async () => {
            try {
                const data = await fetchAllIssues();
                setIssues(data);
            } catch (error) {
                // TODO: Show warning.
                console.log(error);
            }  
        };
        if (isDisplayed) {
            fetchRecentIssues();
        }
    }, [isDisplayed]);

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
                <div id='recent-issues-container'>
                    RECENT ISSUES
                </div>
                <div>
                    {issues &&
                       issues.filter((i) => isThisWeek(new Date(i.last_updated_at))).map((i) => <RecentIssue key={i.issue_id} data={i} />)
                    }
                    {/* <RecentIssue data={{type: 'BUG'}} />
                    <RecentIssue data={{type: 'STORY'}} />
                    <RecentIssue data={{type: 'TASK'}} />
                    <RecentIssue data={{type: 'BUG'}} /> */}
                </div>
            </form>
          </SlidingPane>
        </div>
    );
};

export default SearchIssuePane;