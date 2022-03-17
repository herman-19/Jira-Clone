import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Form, Divider } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import IssueTypeDropdown from './IssueTypeDropdown';
import IssueStatusDropdown from './IssueStatusDropdown';
import AssigneesDropdown from './AssigneesDropdown';
import ReporterDropdown from './ReporterDropdown';
import IssuePriorityDropdown from './IssuePriorityDropdown';
import TrashIcon from './icons/Trash';
import Expand from './icons/Expand';
import Comment from './Comment';

ReactModal.setAppElement("#root");

const Modal = ({ isDiplayed, toggleModal, data }) => {
    const [title, setTitle] = useState('');
    // Description
    const [inEditMode, setInEditMode] = useState(false);
    const [description, setDescription] = useState({ value: '' });
    const [pendingDesc, setPendingDesc] = useState({ value: '' });
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
                <IssueTypeDropdown />
                <div className='issue-options'>
                    <TrashIcon onClick={deleteIssue} />
                    <Expand />
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
                                onChange={e => setTitle({ value: e.target.value })}
                                value={title.value}
                            />
                        </Form>
                        <Form>
                            <div id='issue-modal-label'>Description</div>
                            <TextareaAutosize
                                // defaultValue="Just a single line..."
                                id='issue-modal-title-text'
                                control={TextareaAutosize}
                                placeholder="Description of issue"
                                onChange={e => setPendingDesc({ value: e.target.value })}
                                value={inEditMode ? pendingDesc.value : description.value}
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
                    <IssueStatusDropdown />
                    <div className='issue-modal-info-label'>REPORTER</div>
                    <ReporterDropdown />
                    <div className='issue-modal-info-label'>ASSIGNEES</div>
                    <AssigneesDropdown />
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