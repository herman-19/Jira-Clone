import React from 'react';
import Comment from './Comment';

const Comments = ({comments, users}) => {
    const idToAuthor = new Map();
    for (let c of comments) {
        idToAuthor.set(c.person_id, users[users.findIndex(u => u.person_id === c.person_id)].name);
    }
    const c = comments.map(com => <Comment key={com.comment_id} author={idToAuthor.get(com.person_id)} timestamp={com.created_at} text={com.content}/> );
    return (
        <div id='comments-container'>
            {c}
        </div>
    );
};

export default Comments;