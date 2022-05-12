import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Message, Icon } from 'semantic-ui-react';
import { fetchUserInfo, fetchImageUploadSignedUrl, updateUser, uploadImage } from '../api/UserAPI';
import { useAuth } from '../useAuth';

const UserSettings = ({ pathName }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [uploadURL, setUploadURL] = useState('');
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const info = await fetchUserInfo();
                setName(info.name);
            } catch (error) {
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };
        const getImageUploadURL = async () => {
            try {
                const res = await fetchImageUploadSignedUrl();
                setUploadURL(res.url);
            } catch (error) {
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };
        getUserInfo();
        getImageUploadURL();
    }, []);

    const updateUserInfo = async () => {
        try {
            setUpdating(true);
            await updateUser({name});

            // Do image upload to S3 bucket.
            if (selectedFile) {
                await uploadImage(uploadURL, selectedFile);
            }
            setUpdating(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            if (error.response.status === 401) {
                await auth.unauthorizedLogout(() => {
                  navigate('/');
                });
            } else {
                setUpdating(false);
                setError(true);
                setTimeout(() => setError(false), 2000);
            }
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div id='issue-view'>
            <div id='kanban-path'>
                <span>Projects</span>
                <span>/</span>
                <span>{pathName}</span>
                <span>/</span>
                <span>User Settings</span>
             </div>
             <div id='kanban-header'>
                <p>User Settings</p>
            </div>
            <div className='settings-form-container'>
                <Form>
                    <Form.Field>
                        <label style={{color: '#5E6C84'}}>Name</label>
                        <input value={name} id='settings-desc-text'
                               onChange={e => {setName(e.target.value)}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label style={{color: '#5E6C84'}}>User Image</label>
                        <input id="photoupload" type="file" accept="image/*" onChange={handleFileChange}/>
                    </Form.Field>
                    <div id='desc-editor-buttons'>
                        <Form.Button
                            id='desc-save-button'
                            content="Save"
                            onClick={() => updateUserInfo()}
                        />
                        <Form.Button
                            id='desc-cancel-button'
                            content="Cancel"
                            onClick={() => navigate('/project')}
                        />
                    </div>
                </Form>
                {updating &&
                   <Message icon>
                       <Icon name='circle notched' loading />
                       <Message.Content>
                           <Message.Header>Updating...</Message.Header>
                           </Message.Content>
                   </Message>
                }
                {error &&
                   <Message negative onDismiss={() => {setError(false)}}>
                       <Message.Header>Error:</Message.Header>
                       <p>Could not update user information.</p>
                   </Message>
                }
                {success &&
                   <Message positive onDismiss={() => {setSuccess(false)}}>
                       <Message.Header>Update Succesful</Message.Header>
                       <p>Changes have been saved successfully.</p>
                   </Message>
                }
            </div>
        </div>
    );
};

export default UserSettings;