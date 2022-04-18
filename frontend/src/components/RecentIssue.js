import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskIcon from './icons/IssueTypeTask';
import BugIcon from './icons/IssueTypeBug';
import StoryIcon from './icons/IssueTypeStory';

const cardIconStyle = {
    height: 24,
    width: 24
};

const getIssueTypeIcon = (type) => {
    let icon;
    switch (type) {
        case 'BUG': icon = <BugIcon style={cardIconStyle} />; break;
        case 'TASK': icon = <TaskIcon style={cardIconStyle} />; break;
        case 'STORY': icon = <StoryIcon style={cardIconStyle} />; break;
        default: icon = <TaskIcon />; break;
    }
    return icon;
};

const RecentIssue = ({data, onIssueClick}) => {
    const navigate = useNavigate();
    const loadIssuePage = () => {
        navigate(`/project/issue/${data.issue_id}`);
        onIssueClick();
    };

    return (
        <div onClick={loadIssuePage} className='recent-issue'>
            <div className='issue-card-status'>
                {getIssueTypeIcon(data.type)}
            </div>
            <div className='recent-issue-text'>
                <div className='recent-issue-title'>{data.title}</div>
                <div className='recent-issue-id'>{data.type}-{data.issue_id}</div>
            </div>
        </div>
    );
};

export default RecentIssue;