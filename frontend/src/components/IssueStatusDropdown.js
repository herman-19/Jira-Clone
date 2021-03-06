import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';

// Note the semantic-ui-react Dropdown component warns of findDomNode deprecation.
// Discussion: https://github.com/Semantic-Org/Semantic-UI-React/issues/4050
// See for progress: https://github.com/Semantic-Org/Semantic-UI-React/pull/4233
// To be fixed in semantic ui react v3.

const IssueStatusDropdown = ({ status, updateIssue, issueId, setStatusUpdateInfo }) => {
    const [selected, setSelected] = useState(status);
    useEffect(() => setSelected(status), [status]);

    const issueStatuses = [
        {
            key: 'BACKLOG',
            text: 'BACKLOG',
            value: 'BACKLOG'
        },
        {
            key: 'SELECTED FOR DEVELOPMENT',
            text: 'SELECTED FOR DEVELOPMENT',
            value: 'SELECTED FOR DEVELOPMENT'
        },
        {
            key: 'IN PROGRESS',
            text: 'IN PROGRESS',
            value: 'IN PROGRESS'
        },
        {
            key: 'DONE',
            text: 'DONE',
            value: 'DONE'
        },
    ];

    // Handle selected dropdown issue status.
    const onChange = async (e, { value }) => {
        e.persist();
        if (setStatusUpdateInfo) {
            setStatusUpdateInfo({issueId, oldStatus: status, newStatus: value });
        }
        setSelected(value);
        await updateIssue({ status: value });
    };

    return (
        <Dropdown
            id='dropdown-issue'
            selection
            value={selected}
            options={issueStatuses}
            button={true}
            onChange={onChange}
            style={{ maxHeight: "4px" }}
        />
    );
};

export default IssueStatusDropdown;