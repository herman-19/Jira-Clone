import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Issue from './Issue';
import { useParams } from 'react-router-dom';

const IssueView = () => {
    let { id } = useParams();
    return (
        <div className='container'>
            <Navbar />
            <Sidebar />
            <Issue issueId={id} />
        </div>
    );
};

export default IssueView;