import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import Highest from './icons/IssuePriorityHighest';
import High from './icons/IssuePriorityHigh';
import Medium from './icons/IssuePriorityMedium';
import Low from './icons/IssuePriorityLow';
import Lowest from './icons/IssuePriorityLowest';

// Note the semantic-ui-react Dropdown component warns of findDomNode deprecation.
// Discussion: https://github.com/Semantic-Org/Semantic-UI-React/issues/4050
// See for progress: https://github.com/Semantic-Org/Semantic-UI-React/pull/4233
// To be fixed in semantic ui react v3.

// const dropdownPrioStyle = {
//     height: 18,
//     width: 18,
//     marginRight: '8px'
// };

const IssuePriorityDropdown = () => {
    const [selected, setSelected] = useState('Highest');
    const issueTypes = [
        {
            key: 'Highest',
            text: 'Highest',
            value: 'Highest',
            className: 'font-size-12px',
            // image: (<Highest style={dropdownPrioStyle} />)
        },
        {
            key: 'High',
            text: 'High',
            value: 'High',
            className: 'font-size-12px',
            // image: (<High style={dropdownPrioStyle} />),
        },
        {
            key: 'Medium',
            text: 'Medium',
            value: 'Medium',
            // image: (<Medium style={dropdownPrioStyle} />)
        },
        {
            key: 'Low',
            text: 'Low',
            value: 'Low',
            // image: (<Low style={dropdownPrioStyle} />)
        },
        {
            key: 'Lowest',
            text: 'Lowest',
            value: 'Lowest',
            // image: (<Lowest style={dropdownPrioStyle} />)
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