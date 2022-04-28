import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import { Form } from 'semantic-ui-react';
import { deleteIssue } from '../api/UserAPI';

ReactModal.setAppElement("#root");

const DeleteIssueModal = ({ isDisplayed, onDeleteCancel, issueId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const onDeleteIssueClick = async () => {
        setIsLoading(true);
        await deleteIssue(issueId);
        setIsLoading(false);
        if (location.pathname === '/project') {
            // Refresh kanban view.
            window.location.reload();
        } else {
            // Go to kanban view.
            navigate('/');
        }
    };

    return (
        <ReactModal
        isOpen={isDisplayed}
        onRequestClose={onDeleteCancel}
        contentLabel="modal"
        className="delete-issue-modal"
        overlayClassName="myoverlay"
        closeTimeoutMS={100}
        >
            <div className='create-issue-title'>
                Are you sure you want to delete this issue?
            </div>
            <div>This action is not reversible.</div>
            <div id='delete-issue-buttons'>
                    <Form.Button
                        id='desc-save-button'
                        content="Delete"
                        onClick={onDeleteIssueClick}
                        loading={isLoading}
                    />
                    <Form.Button
                        id='desc-cancel-button'
                        content="Cancel"
                        onClick={onDeleteCancel}
                    />
                </div>
        </ReactModal>
    );
};

export default DeleteIssueModal;