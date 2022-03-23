import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

// Note the semantic-ui-react Dropdown component warns of findDomNode deprecation.
// Discussion: https://github.com/Semantic-Org/Semantic-UI-React/issues/4050
// See for progress: https://github.com/Semantic-Org/Semantic-UI-React/pull/4233
// To be fixed in semantic ui react v3.

const IssuePriorityDropdown = ({ priority }) => {
    const [selected, setSelected] = useState(priority);
    const issueTypes = [
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

    // Handle selected dropdown issue type.
    const onChange = async (e, { value }) => {
        // Update issue type here...
        e.persist();
        setSelected(value);
        console.log(value);
    };

    return (
        <Dropdown
            id='dropdown-issue'
            selection
            defaultValue={selected} // Note, this corresponds to the 'value' attribute in the options.
            options={issueTypes}
            button={true}
            onChange={onChange}
            style={{ maxHeight: "2px" }}
        />
    );
};

export default IssuePriorityDropdown;