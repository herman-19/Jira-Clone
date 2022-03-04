import React from 'react';

const IssueCard = ({ title }) => {
    let type = 'TASK';
    let prio = 'HIGH';
    let assigneeImgs = ['https://cdn.dribbble.com/users/2591291/screenshots/6158597/media/925e65e38adeea6ffc455df381a9ee79.png', 'https://cdn.dribbble.com/users/2591291/screenshots/6158597/media/925e65e38adeea6ffc455df381a9ee79.png'];
    return (
        <div className='issue-card'>
            {title}
        </div>
    );
};

export default IssueCard;