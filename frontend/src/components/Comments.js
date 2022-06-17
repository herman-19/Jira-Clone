import React from 'react';
import Comment from './Comment';

const Comments = ({comments, users}) => {
    const idToUser = new Map();
    for (let c of comments) {
        idToUser.set(c.person_id, users[users.findIndex(u => u.person_id === c.person_id)]);
    }
    const c = comments.map(com => <Comment key={com.comment_id}
                                           author={idToUser.get(com.person_id).name}
                                           imageUrl={idToUser.get(com.person_id).url || ''}
                                           timestamp={com.created_at}
                                           text={com.content}/>
    );
    return (
        <div id='comments-container'>
            {c}
        </div>
    );
};

export default Comments;