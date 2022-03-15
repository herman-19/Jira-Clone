import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

const ReporterDropdown = () => {
    const [selected, setSelected] = useState('A-Train');
    const reporterOptions = [
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
    ];

    // Handle selected reporter.
    const onChange = async (e, { value }) => {
        // Update reporter here...
        e.persist();
        setSelected(value);
        console.log(value);
    };

    return (
        <Dropdown
            id='dropdown-issue-status'
            selection
            defaultValue={selected} // Note, this corresponds to the 'value' attribute in the types.
            options={reporterOptions}
            button={true}
            onChange={onChange}
            style={{ maxHeight: "2px" }}
            search={true}
        />
    );
};

export default ReporterDropdown;