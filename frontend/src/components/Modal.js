import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import { Form, Divider } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import { formatDistance } from 'date-fns';
import IssueTypeDropdown from './IssueTypeDropdown';
import IssueStatusDropdown from './IssueStatusDropdown';
import AssigneesDropdown from './AssigneesDropdown';
import ReporterDropdown from './ReporterDropdown';
import IssuePriorityDropdown from './IssuePriorityDropdown';
import Delete from './icons/Trash';
import Expand from './icons/Expand';
import Close from './icons/Close';
import Comments from './Comments';
import DeleteIssueModal from './DeleteIssueModal';
import { fetchIssue, fetchUsers, updateIssue, fetchComments, createComment, fetchListImagesSignedUrls } from '../api/UserAPI';
import { useAuth } from '../useAuth';

ReactModal.setAppElement("#root");

const Modal = ({ isDiplayed, toggleModal, issue, onPrioUpdate, onTypeUpdate, setStatusUpdateInfo }) => {
    const navigate = useNavigate();
    const auth = useAuth();

    // Title
    const [title, setTitle] = useState(issue.title);

    // Type & Status
    const [type, setType] = useState(issue.type);
    const [status, setStatus] = useState(issue.status);

    // Reporter ID
    const [reporterId, setReporterId] = useState(issue.reporter_id);

    // Users
    const [users, setUsers] = useState(null);
    const [myImageUrl, setMyImageUrl] = useState('');

    // Description
    const [inEditMode, setInEditMode] = useState(false);
    const [description, setDescription] = useState(issue.description);
    const [pendingDesc, setPendingDesc] = useState(issue.description);
    const [displayErrorMsg, setDisplayErrorMsg] = useState(false);
    const saveEdit = async () => {
        try {
            // Description cannot exceed 255 characters.
            if (pendingDesc.length > 255) {
                setDisplayErrorMsg(true);
                setTimeout(() => {setDisplayErrorMsg(false)}, 3500);
                return;
            }
            await doUpdate({ description: pendingDesc });
            setDescription(pendingDesc);
            setInEditMode(false);
        } catch (error) {
            throw error;
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
            if (error.response.status === 401) {
                await auth.unauthorizedLogout(() => {
                  navigate('/');
                });
            }
        }
    };
    const cancelCommentEdit = () => {
        setInEditComMode(false);
        setPendingCom(comment);
    };

    // Priority
    const [priority, setPriority] = useState(issue.priority);

    // Last updated timestamp.
    const [lastUpdated, setLastUpdated] = useState(issue.last_updated_at);

    // Delete issue modal.
    const [isDeleteModalDisplayed, setIsDeleteModalDisplayed] = useState(false);

    const doUpdate = async (data) => {
        try {
            const res = await updateIssue(issue.issue_id, data);
            setLastUpdated(res.last_updated_at);
        } catch (error) {
            if (error.response.status === 401) {
                await auth.unauthorizedLogout(() => {
                  navigate('/');
                });
            }
        }
    };
    const expandIssue = () => {
        navigate(`/project/issue/${issue.issue_id}`);
    };
    const expandDelete = () => {
        setIsDeleteModalDisplayed(true);
    };
    const onDeleteCancel = () => {
        setIsDeleteModalDisplayed(false);
    };

    useEffect(() => {
        const getIssueInfo = async () => {
            try {
                const data = await fetchIssue(issue.issue_id);
                setTitle(data.title);
                setType(data.type);
                setStatus(data.status);
                setReporterId(data.reporter_id);
                setDescription(data.description);
                setPendingDesc(data.description);
                setPriority(data.priority);
                setLastUpdated(data.last_updated_at);
            } catch (error) {
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };
        const getUsers = async () => {
            const users = await fetchUsers();
            const { urlsInfo } = await fetchListImagesSignedUrls();
            for (let urlInfo of urlsInfo) {
                const idx = users.findIndex((user) => user.person_id === parseInt(urlInfo.userId));
                if (idx !== -1) {
                    users[idx].url = urlInfo.url;
                }
                if (parseInt(urlInfo.userId) === auth.myUserId) {
                    setMyImageUrl(urlInfo.url);
                }
            }
            setUsers(users);
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
    }, [isDiplayed, auth, navigate, issue.issue_id]);

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
                <IssueTypeDropdown type={type} updateIssue={doUpdate} onTypeUpdate={onTypeUpdate} issue={issue}/>
                <div className='issue-options'>
                    <Delete onClick={expandDelete} />
                    <Expand expandIssue={expandIssue}/>
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
                                onChange={e => {setTitle(e.target.value); issue.title = e.target.value;}}
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
                    {displayErrorMsg &&  <div id='create-issue-empty-fields'>Description cannot exceed 255 characters.</div>}
                    <Form>
                        <div id='issue-modal-label'>Comments</div>
                        <div id='new-comment-container'>
                            <div id='new-comment-user-img' style={{ backgroundImage: `url(${myImageUrl})` }}/>
                            <div id='pad-left'>
                                <TextareaAutosize
                                    id='comment-text-input'
                                    control={TextareaAutosize}
                                    placeholder="Add a comment..."
                                    onChange={e => setPendingCom({ value: e.target.value })}
                                    value={inEditComMode ? pendingCom.value : comment.value}
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
                <div className='issue-modal-info'>
                    <div className='issue-modal-info-label'>STATUS</div>
                    <IssueStatusDropdown issueId={issue.issue_id} status={status} updateIssue={doUpdate} setStatusUpdateInfo={setStatusUpdateInfo} />
                    <div className='issue-modal-info-label'>REPORTER</div>
                    <ReporterDropdown reporter_id={reporterId} users={users} updateIssue={doUpdate} />
                    <div className='issue-modal-info-label'>ASSIGNEES</div>
                    <AssigneesDropdown issueId={issue.issue_id} users={users} updateIssue={doUpdate} issue={issue}/>
                    <div className='issue-modal-info-label'>PRIORITY</div>
                    <IssuePriorityDropdown priority={priority} updateIssue={doUpdate} onPrioUpdate={onPrioUpdate} issue={issue}/>
                    < Divider />
                    <div className='issue-timestamps-container'>
                        <div>Created {formatDistance(new Date(), new Date(issue.created_at))} ago</div>
                        <div>Updated {formatDistance(new Date(), new Date(lastUpdated))} ago</div>
                    </div>
                </div>
            </div>
            <DeleteIssueModal isDisplayed={isDeleteModalDisplayed} onDeleteCancel={onDeleteCancel} issueId={issue.issue_id} />
        </ReactModal>
    );
};

export default Modal;