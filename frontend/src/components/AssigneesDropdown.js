import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { fetchIssueAssignees } from '../api/UserAPI';

const AssigneeDropdown = ({ issueId, users, updateIssue, issue }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [displayDropdown, setDisplayDropdown] = useState(false);

    const [assigneeOptions, setAssigneeOptions] = useState(null);
    useEffect(() => {
        const getAssignees = async () => {
            try {
                const assigneeIDs = await fetchIssueAssignees(issueId);
                const assignees = [];
                for (let user of users) {
                    if (assigneeIDs.includes(user.person_id)) {
                        assignees.push(user.name);
                    }
                }
                setSelected(assignees);
            } catch (error) {
                if (error.response.status === 401) {
                    await auth.unauthorizedLogout(() => {
                      navigate('/');
                    });
                }
            }
        };

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
            getAssignees();
        }
    }, [users, issueId, auth, navigate]);

    const onChange = async (e, { value }) => {
        // Update assignees here...
        e.persist();
        setSelected(value);

        // Find assignee ids to update issue.
        let newAssigneesReporterIDs = [];
        for (let assigneeName of value) {
            let idx = users.findIndex(u => u.name === assigneeName);
            if (idx !== -1) {
                newAssigneesReporterIDs.push(users[idx].person_id);
            }
        }
        if (issue) {
            issue.assignee_ids = newAssigneesReporterIDs;
        }
        await updateIssue({ assigneeIDs: newAssigneesReporterIDs });
    };

    return (
        <div>
            {(!displayDropdown && selected.length === 0) && <div id='unassigned-issue-text' onClick={() => setDisplayDropdown(true)}>Unassigned</div>}
            {
                (selected.length > 0 || displayDropdown)
                &&
                <Dropdown
                    id='dropdown-issue-assignees'
                    multiple selection
                    value={selected}
                    options={assigneeOptions}
                    button={true}
                    onChange={onChange}
                    search={true}
                    icon={null}
                    onBlur={() => setDisplayDropdown(false)}
                    placeholder='Search assignee(s)'
                />
            }
        </div >
    );
};

export default AssigneeDropdown;