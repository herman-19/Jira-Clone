import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Issue from './Issue';
import { useParams } from 'react-router-dom';
import { fetchProjectInfo } from '../api/UserAPI';

const IssueView = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const getProjectInfo = async () => {
            const info = await fetchProjectInfo();
            setName(info.name);
            setCategory(info.category);
        };
        getProjectInfo();
    }, []);

    let { id } = useParams();
    return (
        <div className='container'>
            <Navbar />
            <Sidebar name={name} category={category}/>
            <Issue issueId={id} />
        </div>
    );
};

export default IssueView;