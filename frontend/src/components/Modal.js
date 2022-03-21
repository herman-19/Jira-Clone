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
import Comment from './Comment';
import { fetchIssue, fetchUsers } from '../api/UserAPI';

ReactModal.setAppElement("#root");

const Modal = ({ isDiplayed, toggleModal, issue }) => {
    const [title, setTitle] = useState(issue.title);
    const [users, setUsers] = useState(null);

    // Description
    const [inEditMode, setInEditMode] = useState(false);
    const [description, setDescription] = useState(issue.description);
    const [pendingDesc, setPendingDesc] = useState(issue.description);
    const saveEdit = () => {
        setDescription(pendingDesc);
        setInEditMode(false);
    };
    const cancelEdit = () => {
        setInEditMode(false);
        setPendingDesc(description);
    };
    // Comment
    const [inEditComMode, setInEditComMode] = useState(false);
    const [comment, setComment] = useState({ value: '' });
    const [pendingCom, setPendingCom] = useState({ value: '' });
    const saveCommentEdit = () => {
        setComment(pendingCom);
        setInEditComMode(false);
    };
    const cancelCommentEdit = () => {
        setInEditComMode(false);
        setPendingCom(comment);
    };
    const deleteIssue = () => {
        console.log('Deleting issue...');
    };

    useEffect(() => {
        const getIssueInfo = async () => {
            const data = await fetchIssue(issue.issue_id);
            setTitle(data.title);
            setDescription(data.description);
            setPendingDesc(data.description);
        };
        const getUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        };
        if (isDiplayed) {
            getIssueInfo();
            getUsers();
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
                <IssueTypeDropdown type={issue.type} />
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
                        <Comment author='Lord Venom' timestamp='a month ago' text='Shake it.' />
                        <Comment author='Lord Venom' timestamp='two months ago' text='Shake it. NOWWW.' />
                    </div>
                </div>
                <div className='issue-modal-info'>
                    <div className='issue-modal-info-label'>STATUS</div>
                    <IssueStatusDropdown status={issue.status} />
                    <div className='issue-modal-info-label'>REPORTER</div>
                    <ReporterDropdown reporter_id={issue.reporter_id} users={users} />
                    <div className='issue-modal-info-label'>ASSIGNEES</div>
                    <AssigneesDropdown issueId={issue.issue_id} users={users} />
                    <div className='issue-modal-info-label'>PRIORITY</div>
                    <IssuePriorityDropdown />
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