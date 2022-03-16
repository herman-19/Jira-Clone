import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

const AssigneeDropdown = () => {
    const [selected, setSelected] = useState(['Butcher']);
    const [displayDropdown, setDisplayDropdown] = useState(false);
    const assigneeOptions = [
        {
            key: 'Lord Venom',
            text: 'Lord Venom',
            value: 'Lord Venom'
        },
        {
            key: 'Homelander',
            text: 'Homelander',
            value: 'Homelander'
        },
        {
            key: 'A-Train',
            text: 'A-Train',
            value: 'A-Train'
        },
        {
            key: 'Mothers Milk',
            text: 'Mothers Milk',
            value: 'Mothers Milk'
        },
        {
            key: 'Butcher',
            text: 'Butcher',
            value: 'Butcher'
        },
        {
            key: 'Frenchie',
            text: 'Frenchie',
            value: 'Frenchie'
        },
    ];

    const onChange = async (e, { value }) => {
        // Update assignees here...
        e.persist();
        setSelected(value);
        console.log(value);
    };

    return (
        <div>
            {(!displayDropdown && selected.length == 0) && <div id='unassigned-issue-text' onClick={() => setDisplayDropdown(true)}>Unassigned</div>}
            {
                (selected.length > 0 || displayDropdown)
                &&
                <Dropdown
                    id='dropdown-issue-assignees'
                    multiple selection
                    defaultValue={selected}
                    options={assigneeOptions}
                    button={true}
                    onChange={onChange}
                    search={true}
                    icon='none'
                    onBlur={() => setDisplayDropdown(false)}
                    placeholder='Search assignee(s)'
                />
            }
        </div >
    );
};

export default AssigneeDropdown;