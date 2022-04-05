import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Divider } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import { formatDistance } from 'date-fns';
import IssueTypeDropdown from './IssueTypeDropdown';
import IssueStatusDropdown from './IssueStatusDropdown';
import AssigneesDropdown from './AssigneesDropdown';
import ReporterDropdown from './ReporterDropdown';
import IssuePriorityDropdown from './IssuePriorityDropdown';
import Delete from './icons/Trash';
import Comments from './Comments';
import { fetchIssue, fetchUsers, updateIssue, fetchComments, createComment } from '../api/UserAPI';

const Issue = ({ issueId }) => {
    const navigate = useNavigate();

    const [loaded, setLoaded] = useState(false);
    const [issueNotFound, setIssueNotFound] = useState(false);
    // Title
    const [title, setTitle] = useState('');

    // Type & Status
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');

    // Reporter ID
    const [reporterId, setReporterId] = useState('');

    // Users
    const [users, setUsers] = useState(null);

    // Description
    const [inEditMode, setInEditMode] = useState(false);
    const [description, setDescription] = useState('');
    const [pendingDesc, setPendingDesc] = useState('');
    const saveEdit = async () => {
        try {
            await doUpdate({ description: pendingDesc });
            setDescription(pendingDesc);
            setInEditMode(false);
        } catch (error) {
            // TODO: Display warning.
            console.log(error);
        }
    };
    const cancelEdit = () => {
        setInEditMode(false);
        setPendingDesc(description);
    };
    // Comment
    const [comments, setComments] = useState([]);
    const [inEditComMode, setInEditComMode] = useState(false);
    const [comment, setComment] = useState({ value: '' });
    const [pendingCom, setPendingCom] = useState({ value: '' });
    const saveCommentEdit = async () => {
        try {
            // Create new comment here...
            const newComment = {
                issueId: issueId,
                content: pendingCom.value
            };
            const storedComment = await createComment(newComment);
            const newComments = [...comments];
            newComments.push(storedComment);

            // Update comments displayed and clear text area.
            setComments(newComments);
            setComment({value: ''});
            setPendingCom({value: ''});
            setInEditComMode(false);
        } catch (error) {
            console.log(error);
        }
    };
    const cancelCommentEdit = () => {
        setInEditComMode(false);
        setPendingCom(comment);
    };
    const deleteIssue = () => {
        console.log('Deleting issue...');
    };
    // Priority
    const [priority, setPriority] = useState('');
    // Timestamps.
    const [lastUpdated, setLastUpdated] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    const doUpdate = async (data) => {
        try {
            const res = await updateIssue(issueId, data);
            setLastUpdated(res.last_updated_at);
        } catch (error) {
            // TODO: Display warning.
            console.log(error);
        }
    };

    useEffect(() => {
        const getIssueInfo = async () => {
            try {
                if (isNaN(issueId)) {
                    throw new Error('Invalid issue id');
                }
                const data = await fetchIssue(issueId);
                if (data) {
                    setTitle(data.title);
                    setType(data.type);
                    setStatus(data.status);
                    setReporterId(data.reporter_id);
                    setDescription(data.description);
                    setPendingDesc(data.description);
                    setPriority(data.priority);
                    setCreatedAt(data.created_at);
                    setLastUpdated(data.last_updated_at);
                } else {
                    throw new Error('Issue does not exist');
                }
            } catch (error) {
                throw error;
            }
        };
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                throw error;
            }
        };
        const getComments = async () => {
            try {
                if (isNaN(issueId)) {
                    throw new Error('Invalid issue id');
                }
                const data = await fetchComments(issueId);
                setComments(data);
            } catch (error) {
                throw new Error('error with getIssueInfo');
            }
        };
        Promise.all([getIssueInfo(), getUsers(), getComments()])
        .then(values => {
            setLoaded(true);
        })
        .catch(error => {
            setIssueNotFound(true);
        });

    }, [issueId]);

    return (
        <div id='issue-view'>
                  <div id='kanban-path'>
                      <span>Projects</span>
                      <span>/</span>
                      <span>Jira Clone</span>
                      <span>/</span>
                      <span>Issues</span>
                      <span>/</span>
                      <span>{issueId}</span>
                   </div>
            { loaded && 
              <div>
                <div className='issue-modal-top'>
                    <IssueTypeDropdown type={type} updateIssue={doUpdate} />
                    <div className='issue-options'>
                        <Delete onClick={deleteIssue} />
                    </div>
                </div>
                <div className='issue-modal-body'>
                    <div className='issue-modal-desc-comments'>
                        <div className='issue-modal-title'>
                            <Form>
                                <TextareaAutosize
                                    // defaultValue="Just a single line..."
                                    id='issue-modal-title-text'
                                    control={TextareaAutosize}
                                    placeholder="Issue Title"
                                    onChange={e => setTitle(e.target.value)}
                                    onBlur={() => doUpdate({ title })}
                                    value={title}
                                />
                            </Form>
                        </div>
                        <Form>
                            <div id='issue-modal-label'>Description</div>
                            <TextareaAutosize
                                // defaultValue="Just a single line..."
                                id='issue-modal-title-text'
                                control={TextareaAutosize}
                                placeholder="Description of issue"
                                onChange={e => setPendingDesc(e.target.value)}
                                value={inEditMode ? pendingDesc : description}
                                style={{ fontSize: '14px' }}
                                onFocus={() => setInEditMode(true)}
                            />
                            {inEditMode &&
                                <div id='desc-editor-buttons'>
                                    <Form.Button
                                        id='desc-save-button'
                                        content="Save"
                                        onClick={saveEdit}
                                    />
                                    <Form.Button
                                        id='desc-cancel-button'
                                        content="Cancel"
                                        onClick={cancelEdit}
                                    />
                                </div>
                            }
                        </Form>
                        <Form>
                            <div id='issue-modal-label'>Comments</div>
                            <div id='new-comment-container'>
                                <div id='new-comment-user-img' />
                                <div id='pad-left'>
                                    <TextareaAutosize
                                        id='comment-text-input'
                                        control={TextareaAutosize}
                                        placeholder="Add a comment..."
                                        onChange={e => setPendingCom({ value: e.target.value })}
                                        value={inEditComMode ? pendingCom.value : comment.value}
                                        // style={{ fontSize: '14px' }}
                                        onFocus={() => setInEditComMode(true)}
                                    />
                                    {inEditComMode &&
                                        <div id='desc-editor-buttons'>
                                            <Form.Button
                                                id='desc-save-button'
                                                content="Save"
                                                onClick={saveCommentEdit}
                                            />
                                            <Form.Button
                                                id='desc-cancel-button'
                                                content="Cancel"
                                                onClick={cancelCommentEdit}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </Form>
                        {
                            (comments.length > 0) && users && <Comments comments={comments} users={users} />
                        }
                    </div>
                    <div className='issue-modal-info'>
                        <div className='issue-modal-info-label'>STATUS</div>
                        <IssueStatusDropdown issueId={issueId} status={status} updateIssue={doUpdate} />
                        <div className='issue-modal-info-label'>REPORTER</div>
                        <ReporterDropdown reporter_id={reporterId} users={users} updateIssue={doUpdate} />
                        <div className='issue-modal-info-label'>ASSIGNEES</div>
                        <AssigneesDropdown issueId={issueId} users={users} updateIssue={doUpdate}/>
                        <div className='issue-modal-info-label'>PRIORITY</div>
                        <IssuePriorityDropdown priority={priority} updateIssue={doUpdate}/>
                        < Divider />
                        <div className='issue-timestamps-container'>
                            <div>Created {formatDistance(new Date(), new Date(createdAt))} ago</div>
                            <div>Updated {formatDistance(new Date(), new Date(lastUpdated))} ago</div>
                        </div>
                    </div>
                </div>
              </div>
            }
            {
                issueNotFound &&
                <div id='issue-not-found'>
                    <h2>Issue not found</h2>
                    <p className='underline-hover'
                    onClick={() => {
                        navigate('/');
                    }}
                    >
                        Return to Kanban Board
                    </p>
                </div>
            }
        </div>
    );
};

export default Issue;