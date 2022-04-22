import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

// Note the semantic-ui-react Dropdown component warns of findDomNode deprecation.
// Discussion: https://github.com/Semantic-Org/Semantic-UI-React/issues/4050
// See for progress: https://github.com/Semantic-Org/Semantic-UI-React/pull/4233
// To be fixed in semantic ui react v3.

const CreateIssuePriorityDropdown = ({ onPrioUpdate }) => {
    const [selected, setSelected] = useState('MEDIUM');

    const issuePriorities = [
        {
            key: 'HIGHEST',
            text: 'HIGHEST',
            value: 'HIGHEST'
        },
        {
            key: 'HIGH',
            text: 'HIGH',
            value: 'HIGH'
        },
        {
            key: 'MEDIUM',
            text: 'MEDIUM',
            value: 'MEDIUM'
        },
        {
            key: 'LOW',
            text: 'LOW',
            value: 'LOW'
        },
        {
            key: 'LOWEST',
            text: 'LOWEST',
            value: 'LOWEST'
        },
    ];

    // Handle selected dropdown issue priority.
    const onChange = async (e, { value }) => {
        e.persist();
        setSelected(value);
        onPrioUpdate(value);
    };

    return (
        <Dropdown
            id='dropdown-issue-create'
            selection
            value={selected}
            options={issuePriorities}
            button={true}
            onChange={onChange}
            style={{ maxHeight: "2px" }}
        />
    );
};

export default CreateIssuePriorityDropdown;