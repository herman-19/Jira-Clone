import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Issue from './Issue';
import { useParams } from 'react-router-dom';

const IssueView = ({ projectName, projectCategory }) => {
    let { id } = useParams();
    return (
        <div className='container'>
            <Navbar />
            <Sidebar name={projectName} category={projectCategory}/>
            <Issue issueId={id} name={projectName}/>
        </div>
    );
};

export default IssueView;