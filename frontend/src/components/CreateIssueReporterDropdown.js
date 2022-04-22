import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useAuth } from '../useAuth';

const CreateIssueReporterDropdown = ({ users, onReporterSelect }) => {
    const [reporter, setReporter] = useState(null);
    const [reporterOptions, setReporterOptions] = useState(null);
    const auth = useAuth();

    useEffect(() => {
        if (users) {
            const options = [];
            for (let user of users) {
                // Set default selected reporter to logged in user.
                if (user.person_id === auth.myUserId) {
                    setReporter(user.name);
                }
                options.push({
                    name: user.person_id,
                    text: user.name,
                    value: user.name
                });
            }
            setReporterOptions(options);
        }
    }, [users]);

    // Handle selected reporter.
    const onChange = async (e, { value }) => {
        e.persist();
        setReporter(value);
        // Find reporter id of selected value.
        let idx = reporterOptions.findIndex(r => r.value === value);
        if (idx !== -1) {
            let reporterId = reporterOptions[idx].name;
            onReporterSelect(reporterId);
        }
    };

    return (
        <Dropdown
            selection
            value={reporter}
            options={reporterOptions}
            button={true}
            onChange={onChange}
            style={{ maxHeight: '2px', marginBottom: '14px' }}
            search={true}
        />
    );
};

export default CreateIssueReporterDropdown;