import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Dropdown, Message, Icon } from 'semantic-ui-react';
import TextareaAutosize from "react-textarea-autosize";
import { fetchProjectInfo, updateProject } from '../api/UserAPI';

const Settings = ({pathName, onNameSave, onCategorySave}) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const categories = [
        {
            key: 'BUSINESS',
            text: 'Business',
            value: 'BUSINESS'
        },
        {
            key: 'MARKETING',
            text: 'Marketing',
            value: 'MARKETING'
        },
        {
            key: 'SOFTWARE',
            text: 'Software',
            value: 'SOFTWARE'
        }
    ];

    const handleSelect = (e, { value }) => {
        setCategory(value);
    };

    useEffect(() => {
        const getProjectInfo = async () => {
            const info = await fetchProjectInfo();
            setName(info.name);
            setUrl(info.url);
            setCategory(info.category);
            setDescription(info.description);
        };
        getProjectInfo();
    }, []);

    const updateProjectInfo = async () => {
        try {
            setUpdating(true);
            const info = {
                name,
                url,
                category,
                description
            };
            await updateProject(info);
            onNameSave(name);
            onCategorySave(category);
            setUpdating(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            setUpdating(false);
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div id='issue-view'>
            <div id='kanban-path'>
                <span>Projects</span>
                <span>/</span>
                <span>{pathName}</span>
                <span>/</span>
                <span>Settings</span>
             </div>
             <div id='kanban-header'>
                <p>Project Settings</p>
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
                        <label style={{color: '#5E6C84'}}>URL</label>
                        <input value={url} id='settings-desc-text'
                               onChange={e => {setUrl(e.target.value)}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label style={{color: '#5E6C84'}}>Category</label>
                        <Dropdown
                            id='dropdown-category'
                            selection
                            value={category}
                            options={categories}
                            button={true}
                            onChange={handleSelect}
                            style={{ maxHeight: '2px' }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label style={{color: '#5E6C84'}}>Description</label>
                        <TextareaAutosize
                                id='settings-desc-text'
                                control={TextareaAutosize}
                                placeholder="Issue Title"
                                onChange={e => {setDescription(e.target.value)}}
                                value={description}
                            />
                    </Form.Field>
                    <div id='desc-editor-buttons'>
                        <Form.Button
                            id='desc-save-button'
                            content="Save"
                            onClick={() => updateProjectInfo()}
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
                       <p>Could not update project details.</p>
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

export default Settings;