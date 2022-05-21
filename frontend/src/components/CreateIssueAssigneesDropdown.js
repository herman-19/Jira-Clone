import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';

const CreateIssueAssigneesDropdown = ({ users, onAssigneesSelect}) => {
    const [selected, setSelected] = useState([]);
    const [assigneeOptions, setAssigneeOptions] = useState(null);
    useEffect(() => {
        if (users) {
            const options = [];
            for (let user of users) {
                options.push({
                    name: user.person_id,
                    text: user.name,
                    value: user.name
                });
            }
            setAssigneeOptions(options);
        }
    }, [users]);

    const onChange = async (e, { value }) => {
        // Update assignees here...
        e.persist();
        setSelected(value);

        // Find assignee ids of selected assignees.
        let newAssigneeIDs = [];
        for (let assigneeName of value) {
            let idx = users.findIndex(u => u.name === assigneeName);
            if (idx !== -1) {
                newAssigneeIDs.push(users[idx].person_id);
            }
        }
        onAssigneesSelect(newAssigneeIDs);
    };

    return (
        <div>
            {
                <Dropdown
                    multiple selection
                    value={selected}
                    options={assigneeOptions}
                    button={true}
                    onChange={onChange}
                    search={true}
                    placeholder='Search assignee(s)'
                    style={{width: '100%', fontWeight: 'light'}}
                />
            }
        </div >
    );
};

export default CreateIssueAssigneesDropdown;