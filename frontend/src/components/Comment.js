import React from 'react';

const Comment = ({ author, timestamp, text }) => {
    return (
        <div id='new-comment-container'>
            <div id='new-comment-user-img' />
            <div id='pad-left'>
                <div id='user-comment-author'>{author}</div>
                <div id='user-comment-timestamp'>{timestamp}</div>
                <p id='user-comment'>{text}</p>
            </div>
        </div>
    );
};

export default Comment;