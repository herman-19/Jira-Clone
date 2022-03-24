import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';

const ReporterDropdown = ({ reporter_id, users, updateIssue }) => {
    const [reporter, setReporter] = useState(null);
    const [reporterOptions, setReporterOptions] = useState(null);

    useEffect(() => {
        if (users) {
            const options = [];
            for (let user of users) {
                if (user.person_id === reporter_id) {
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
    }, [reporter_id, users]);

    // Handle selected reporter.
    const onChange = async (e, { value }) => {
        e.persist();
        setReporter(value);
        // Find reporter id of selected value.
        let idx = reporterOptions.findIndex(r => r.value === value);
        if (idx !== -1) {
            let reporterId = reporterOptions[idx].name;
            await updateIssue({ reporter_id: reporterId });
        }
    };

    return (
        <Dropdown
            id='dropdown-issue'
            selection
            value={reporter}
            options={reporterOptions}
            button={true}
            onChange={onChange}
            style={{ maxHeight: "2px" }}
            search={true}
        />
    );
};

export default ReporterDropdown;