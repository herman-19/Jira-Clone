import React, { useState, useEffect, useContext } from 'react';
import TaskIcon from './icons/IssueTypeTask';
import BugIcon from './icons/IssueTypeBug';
import StoryIcon from './icons/IssueTypeStory';
import LowestPrioIcon from './icons/IssuePriorityLowest';
import LowPrioIcon from './icons/IssuePriorityLow';
import MedPrioIcon from './icons/IssuePriorityMedium';
import HighPrioIcon from './icons/IssuePriorityHigh';
import HighestPrioIcon from './icons/IssuePriorityHighest';
import Modal from './Modal';
import { kanbanContext } from './Kanban';

const cardIconStyle = {
    height: 18,
    width: 18
};

const getIssuePrioIcon = (prio) => {
    let icon;
    switch (prio) {
        case 'LOWEST': icon = <LowestPrioIcon style={cardIconStyle} />; break;
        case 'LOW': icon = <LowPrioIcon style={cardIconStyle} />; break;
        case 'MEDIUM': icon = <MedPrioIcon style={cardIconStyle} />; break;
        case 'HIGH': icon = <HighPrioIcon style={cardIconStyle} />; break;
        case 'HIGHEST': icon = <HighestPrioIcon style={cardIconStyle} />; break;
        default: icon = <LowestPrioIcon style={cardIconStyle} />; break;
    }
    return icon;
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

const IssueCard = ({ issue, onStatusUpdate }) => {
    const users = useContext(kanbanContext);
    const [displayModal, setDisplayModal] = useState(false);
    const [statusUpdateInfo, setStatusUpdateInfo] = useState(null);
    const toggleModal = () => {
        if (displayModal) {
            // Modal is being closed.
            if (statusUpdateInfo) {
                // Since there was a change in status via the modal, the issue card is moved to the corresponding column.
                // Note: This logic takes place when the Modal is closed/unmounted to avoid state update of an unmounted component.
                if (statusUpdateInfo.oldStatus !== statusUpdateInfo.newStatus) {
                    onStatusUpdate(statusUpdateInfo.issueId, statusUpdateInfo.oldStatus, statusUpdateInfo.newStatus);
                }
                setStatusUpdateInfo(null);
            }
        }
        setDisplayModal(!displayModal);
    };
    const [issuePriority, setIssuePriority] = useState(issue.priority);
    const [issueType, setIssueType] = useState(issue.type);
    useEffect(()=> {setIssuePriority(issuePriority)}, [issuePriority]);
    useEffect(()=> {setIssueType(issueType)}, [issueType]);

    return (
        <div>
            <div className='issue-card' onClick={toggleModal}>
                {issue.title}
                <div className='issue-card-info'>
                    <div className='issue-card-status'>
                        {getIssueTypeIcon(issueType)}
                        {getIssuePrioIcon(issuePriority)}
                    </div>

                    <div className='issue-card-user-icons-container'>
                        <div className='issue-card-user-icon-container'>
                            {
                                issue.assignee_ids && issue.assignee_ids.map((id, index) => {
                                    let url = '';
                                    if (users) {
                                        const idx = users.findIndex((u) => u.person_id === id);
                                        url = (idx !== -1) ? users[idx].url : '';
                                    }
                                    return (
                                        <div
                                        className='card-user-icon'
                                        key={index}
                                        style={{backgroundImage:`url(${url})`}}
                                    />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal isDiplayed={displayModal}
                   toggleModal={toggleModal}
                   issue={issue}
                   onPrioUpdate={setIssuePriority}
                   onTypeUpdate={setIssueType}
                   setStatusUpdateInfo={setStatusUpdateInfo} />
        </div>
    );
};

export default IssueCard;