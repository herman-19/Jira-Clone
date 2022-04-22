import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import BugIcon from './icons/IssueTypeBug';
import StoryIcon from './icons/IssueTypeStory';
import TaskIcon from './icons/IssueTypeTask';

// Note the semantic-ui-react Dropdown component warns of findDomNode deprecation.
// Discussion: https://github.com/Semantic-Org/Semantic-UI-React/issues/4050
// See for progress: https://github.com/Semantic-Org/Semantic-UI-React/pull/4233
// To be fixed in semantic ui react v3.

const dropdownIconStyle = {
    marginRight: '0.78571429rem',
    height: 18,
    width: 18,
    display: 'inline-block',
    verticalAlign: 'top',
    marginTop: '0px',
    marginBottom: '-0.5em',
    maxHeight: '2em'
};

const CreateIssueTypeDropdown = ({ onTypeUpdate }) => {
    const [selected, setSelected] = useState('TASK');

    const issueTypes = [
        {
            key: 'BUG',
            text: 'BUG',
            value: 'BUG',
            image: (<BugIcon style={dropdownIconStyle} />)
        },
        {
            key: 'STORY',
            text: 'STORY',
            value: 'STORY',
            image: (<StoryIcon style={dropdownIconStyle} />),
        },
        {
            key: 'TASK',
            text: 'TASK',
            value: 'TASK',
            image: (<TaskIcon style={dropdownIconStyle} />)
        },
    ];

    // Handle selected dropdown issue type.
    const onChange = async (e, { value }) => {
        e.persist();
        setSelected(value);
        onTypeUpdate(value);
    };

    return (
        <Dropdown
            id='dropdown-issue-create'
            selection
            value={selected}
            options={issueTypes}
            button={true}
            onChange={onChange}
            style={{ maxHeight: '2px' }}
        />
    );
};

export default CreateIssueTypeDropdown;