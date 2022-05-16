import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { Form } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from "react-textarea-autosize";
import CreateIssueTypeDropdown from './CreateIssueTypeDropdown';
import CreateIssuePriorityDropdown from './CreateIssuePriorityDropdown';
import CreateIssueReporterDropdown from './CreateIssueReporterDropdown';
import CreateIssueAssigneesDropdown from './CreateIssueAssigneesDropdown';
import { fetchUsers, createIssue } from '../api/UserAPI';
import { useAuth } from '../useAuth';

ReactModal.setAppElement("#root");

const CreateIssueModal = ({ isDiplayed, toggleModal, afterCreate }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [type, setType] = useState('TASK');
    const [priority, setPriority] = useState('MEDIUM');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState(null);
    const [reporter, setReporter] = useState(auth.myUserId);
    const [assignees, setAssignees] = useState([]);
    const [displayErrorMsg, setDisplayErrorMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetStates = () => {
        setType('TASK');
        setPriority('MEDIUM');
        setSummary('');
        setDescription('');
        setReporter(auth.myUserId);
        setAssignees([]);
        setIsLoading(false);
    };
    const onModalClose = () => {
        // Reset state values.
        resetStates();
        toggleModal();
    };
    const onCreateIssueClick = async () => {
        // Validation.
        // Summary cannot be empty, or exceed 255 characters.
        // Description can be empty, and cannot exceed 255 characters.
        setDisplayErrorMsg(false);
        let messages = [];
        if (summary.length === 0 || summary.trim() === '') {
            messages.push('Summary field cannot be empty.');
        } else if (summary.length > 255) {
            messages.push('Summary cannot exceed 255 characters.');
        }
        if (description.length > 255) {
            messages.push('Description cannot exceed 255 characters.');
        }
        if (messages.length > 0) {
            setErrorMsg(messages);
            setDisplayErrorMsg(true);
            setTimeout(() => {setDisplayErrorMsg(false)}, 3500);
            return;
        }

        const newIssue = {
            type,
            status: 'BACKLOG',
            priority,
            title: summary,
            description,
            reporterId: reporter,
            assigneeIDs: assignees
        };

        try {
            // Call new api function here
            setIsLoading(true);
            await createIssue(newIssue);
        } catch (error) {
            if (error.response.status === 401) {
                await auth.unauthorizedLogout(() => {
                  navigate('/');
                });
            }
        } finally {
            resetStates();
            afterCreate();
        }
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };
        if (isDiplayed) {
            getUsers();
        }
    },[isDiplayed, auth, navigate]);

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
                <CreateIssueTypeDropdown onTypeUpdate={setType}/>
                <div className='create-issue-subheader'>Issue Priority</div>
                <CreateIssuePriorityDropdown onPrioUpdate={setPriority}/>
                <div className='create-issue-subheader'>Short Summary</div>
                <Form style={{marginBottom: '14px'}}>
                    <Form.Field>
                        <input value={summary} onChange={e => setSummary(e.target.value)} />
                    </Form.Field>
                    <div className='create-issue-subheader'>Description</div>
                    <TextareaAutosize
                        control={TextareaAutosize}
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        style={{ fontSize: '14px', resize:'none' }}
                    />
                </Form>
                <div className='create-issue-subheader'>Reporter</div>
                <CreateIssueReporterDropdown users={users} onReporterSelect={setReporter} />
                <div className='create-issue-subheader'>Assignees</div>
                <CreateIssueAssigneesDropdown users={users} onAssigneesSelect={setAssignees}/>
                <div id='create-issue-buttons'>
                    <Form.Button
                        id='desc-save-button'
                        content="Create Issue"
                        onClick={onCreateIssueClick}
                        loading={isLoading}
                    />
                    <Form.Button
                        id='desc-cancel-button'
                        content="Cancel"
                        onClick={onModalClose}
                    />
                </div>
                {displayErrorMsg && errorMsg.map((m, index) => <div id='create-issue-empty-fields' key={index}>{m}</div>)}
            </div>
        </ReactModal>
    );
};

export default CreateIssueModal;