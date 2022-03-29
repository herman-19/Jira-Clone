import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { Form, Divider } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import IssueTypeDropdown from './IssueTypeDropdown';
import IssueStatusDropdown from './IssueStatusDropdown';
import AssigneesDropdown from './AssigneesDropdown';
import ReporterDropdown from './ReporterDropdown';
import IssuePriorityDropdown from './IssuePriorityDropdown';
import Delete from './icons/Trash';
import Expand from './icons/Expand';
import Close from './icons/Close';
import Comments from './Comments';
import { fetchIssue, fetchUsers, updateIssue, fetchComments, createComment } from '../api/UserAPI';

ReactModal.setAppElement("#root");

const Modal = ({ isDiplayed, toggleModal, issue }) => {
    // Title
    const [title, setTitle] = useState(issue.title);

    // Type & Status
    const [type, setType] = useState(issue.type);
    const [status, setStatus] = useState(issue.status);

    // Reporter ID
    const [reporterId, setReporterId] = useState(issue.reporter_id);

    // Users
    const [users, setUsers] = useState(null);

    // Description
    const [inEditMode, setInEditMode] = useState(false);
    const [description, setDescription] = useState(issue.description);
    const [pendingDesc, setPendingDesc] = useState(issue.description);
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
                issueId: issue.issue_id,
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
    const [priority, setPriority] = useState(issue.priority);

    const doUpdate = async (data) => {
        try {
            console.log('do Update...');
            console.log(data);
            await updateIssue(issue.issue_id, data);
        } catch (error) {
            // TODO: Display warning.
            console.log(error);
        }
    };

    useEffect(() => {
        const getIssueInfo = async () => {
            const data = await fetchIssue(issue.issue_id);
            setTitle(data.title);
            setType(data.type);
            setStatus(data.status);
            setReporterId(data.reporter_id);
            setDescription(data.description);
            setPendingDesc(data.description);
            setPriority(data.priority);
        };
        const getUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        };
        const getComments = async () => {
             const data = await fetchComments(issue.issue_id);
             setComments(data);
        };
        if (isDiplayed) {
            getIssueInfo();
            getUsers();
            getComments();
        }
    }, [isDiplayed]);

    return (
        <ReactModal
            isOpen={isDiplayed}
            onRequestClose={toggleModal}
            contentLabel="modal"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={100}
        >
            <div className='issue-modal-top'>
                <IssueTypeDropdown type={type} updateIssue={doUpdate} />
                <div className='issue-options'>
                    <Delete onClick={deleteIssue} />
                    <Expand />
                    <Close toggleModal={toggleModal} />
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
                            (comments.length > 0) && users && isDiplayed && <Comments comments={comments} users={users} />
                        }
                    </div>
                </div>
                <div className='issue-modal-info'>
                    <div className='issue-modal-info-label'>STATUS</div>
                    <IssueStatusDropdown status={status} updateIssue={doUpdate} />
                    <div className='issue-modal-info-label'>REPORTER</div>
                    <ReporterDropdown reporter_id={reporterId} users={users} updateIssue={doUpdate} />
                    <div className='issue-modal-info-label'>ASSIGNEES</div>
                    <AssigneesDropdown issueId={issue.issue_id} users={users} updateIssue={doUpdate} />
                    <div className='issue-modal-info-label'>PRIORITY</div>
                    <IssuePriorityDropdown priority={priority} updateIssue={doUpdate} />
                    < Divider />
                    <div className='issue-timestamps-container'>
                        <div>Created at 3 months ago</div>
                        <div>Updated at 1 month ago</div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default Modal;