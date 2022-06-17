import React from 'react';
import { format } from 'date-fns';

const Comment = ({ author, timestamp, text, imageUrl }) => {
    return (
        <div id='new-comment-container'>
            <div id='new-comment-user-img' style={{backgroundImage: `url(${imageUrl})`}}/>
            <div id='pad-left'>
                <div id='user-comment-author'>{author}</div>
                <div id='user-comment-timestamp'>{format(new Date(timestamp), "MMM d, yyyy, h:mm:ss a")}</div>
                <p id='user-comment'>{text}</p>
            </div>
        </div>
    );
};

export default Comment;