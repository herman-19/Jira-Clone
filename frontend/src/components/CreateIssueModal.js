import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { Form } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import CreateIssueTypeDropdown from './CreateIssueTypeDropdown';
import CreateIssuePriorityDropdown from './CreateIssuePriorityDropdown';
import CreateIssueReporterDropdown from './CreateIssueReporterDropdown';
import CreateIssueAssigneesDropdown from './CreateIssueAssigneesDropdown';
import { fetchUsers } from '../api/UserAPI';

ReactModal.setAppElement("#root");

const CreateIssueModal = ({isDiplayed, toggleModal}) => {
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState(null);
    const [reporter, setReporter] = useState(null);
    const [assignees, setAssignees] = useState([]);

    const onTypeUpdate = (val) => {
        console.log(`Selected issue type: ${val}`);
    };
    const onPrioUpdate = (val) => {
        console.log(`Selected issue priority: ${val}`);
    };
    const onSummaryChange = (e) => {
        setSummary(e.target.value);
        console.log(`Summary: ${e.target.value}`);
    };
    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
        console.log(`Description: ${e.target.value}`);
    };
    const onReporterSelect = (val) => {
        setReporter(val);
        console.log(`Reporter: ${val}`);
    };
    const onAssigneesSelect = (val) => {
        setAssignees(val);
        console.log('Assignees:');
        console.log(val);
    };
    const onModalClose = () => {
        setSummary('');
        setDescription('');
        toggleModal();
    };

    useEffect(() => {
        const getUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        };
        if (isDiplayed) {
            getUsers();
        }
    },[isDiplayed]);

    return (
        <ReactModal
        isOpen={isDiplayed}
        onRequestClose={onModalClose}
        contentLabel="modal"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={100}
        >
            <div className='create-issue-modal-body'>
                <div className='create-issue-title'>
                    Create Issue
                </div>
                <div className='create-issue-subheader'>Issue Type</div>
                <CreateIssueTypeDropdown onTypeUpdate={onTypeUpdate}/>
                <div className='create-issue-subheader'>Issue Priority</div>
                <CreateIssuePriorityDropdown onPrioUpdate={onPrioUpdate}/>
                <div className='create-issue-subheader'>Short Summary</div>
                <Form style={{marginBottom: '14px'}}>
                    <Form.Field>
                        <input value={summary} onChange={onSummaryChange} />
                    </Form.Field>
                    <div className='create-issue-subheader'>Description</div>
                    <TextareaAutosize
                        control={TextareaAutosize}
                        onChange={onDescriptionChange}
                        value={description}
                        style={{ fontSize: '14px', resize:'none' }}
                    />
                </Form>
                <div className='create-issue-subheader'>Reporter</div>
                <CreateIssueReporterDropdown users={users} onReporterSelect={onReporterSelect} />
                <div className='create-issue-subheader'>Assignees</div>
                <CreateIssueAssigneesDropdown users={users} onAssigneesSelect={onAssigneesSelect}/>
                <div id='create-issue-buttons'>
                    <Form.Button
                        id='desc-save-button'
                        content="Create Issue"
                        // onClick={saveCommentEdit}
                    />
                    <Form.Button
                        id='desc-cancel-button'
                        content="Cancel"
                        // onClick={cancelCommentEdit}
                    />
                </div>
            </div>
        </ReactModal>
    );
};

export default CreateIssueModal;