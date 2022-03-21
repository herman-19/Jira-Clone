import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { fetchUsers } from '../api/UserAPI';

const ReporterDropdown = ({ reporter_id }) => {
    const [reporter, setReporter] = useState(null);
    const [reporterOptions, setReporterOptions] = useState(null);

    useEffect(() => {
        const fetchReporter = async () => {
            try {
                const reporters = await fetchUsers();
                const options = [];
                for (let user of reporters) {
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
            } catch (error) {
                // TODO: Show warning.
                console.log(error);
            }
        };
        fetchReporter();
    }, [reporter_id]);

    // Handle selected reporter.
    const onChange = async (e, { value }) => {
        // Update reporter here...
        e.persist();
        setReporter(value);
        console.log(value);
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