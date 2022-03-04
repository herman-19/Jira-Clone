import React from 'react';
import TaskIcon from './icons/IssueTypeTask';
import BugIcon from './icons/IssueTypeBug';
import StoryIcon from './icons/IssueTypeStory';
import LowestPrioIcon from './icons/IssuePriorityLowest';
import LowPrioIcon from './icons/IssuePriorityLow';
import MedPrioIcon from './icons/IssuePriorityMedium';
import HighPrioIcon from './icons/IssuePriorityHigh';
import HighestPrioIcon from './icons/IssuePriorityHighest';

const getIssuePrioIcon = (prio) => {
    let icon;
    switch (prio) {
        case 'LOWEST': icon = <LowestPrioIcon />; break;
        case 'LOW': icon = <LowPrioIcon />; break;
        case 'MEDIUM': icon = <MedPrioIcon />; break;
        case 'HIGH': icon = <HighPrioIcon />; break;
        case 'HIGHEST': icon = <HighestPrioIcon />; break;
        default: icon = <LowestPrioIcon />; break;
    }
    return icon;
};

const getIssueTypeIcon = (type) => {
    let icon;
    switch (type) {
        case 'BUG': icon = <BugIcon />; break;
        case 'TASK': icon = <TaskIcon />; break;
        case 'STORY': icon = <StoryIcon />; break;
        default: icon = <TaskIcon />; break;
    }
    return icon;
};

const IssueCard = ({ title, type, prio }) => {
    return (
        <div className='issue-card'>
            {title}
            <div className='issue-card-info'>
                <div className='issue-card-status'>
                    {getIssueTypeIcon(type)}
                    {getIssuePrioIcon(prio)}
                </div>

                <div className='issue-card-user-icons-container'>
                    <div className='issue-card-user-icon-container'>
                        <div className='card-user-icon' />
                        <div className='card-user-icon' />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IssueCard;