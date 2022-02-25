import React from 'react';
import KanbanIcon from './icons/Kanban';
import SettingsIcon from './icons/Settings';
import ReleaseIcon from './icons/Release';
import IssuesFiltersIcon from './icons/IssuesFilters';
import PagesIcon from './icons/Pages';
import ReportsIcon from './icons/Reports';
import ComponentsIcon from './icons/Components';

const Sidebar = () => {
    return (
        <div id='sidebar'>
            <div id='sidebar-title'>
                <p>Jira Clone | Software Project</p>
            </div>
            <div className='sidebar-item'>
                <KanbanIcon />
                <p>Kanban Board</p>
            </div>
            <div className='sidebar-item'>
                <SettingsIcon />
                <p>Project Settings</p>
            </div>
            <div id='sidebar-divider' />
            <div className='sidebar-item'>
                <ReleaseIcon />
                <p>Releases</p>
            </div>
            <div className='sidebar-item'>
                <IssuesFiltersIcon />
                <p>Issues and Filters</p>
            </div>
            <div className='sidebar-item'>
                <PagesIcon />
                <p>Pages</p>
            </div>
            <div className='sidebar-item'>
                <ReportsIcon />
                <p>Reports</p>
            </div>
            <div className='sidebar-item'>
                <ComponentsIcon />
                <p>Components</p>
            </div>
        </div>

    );
};

export default Sidebar;