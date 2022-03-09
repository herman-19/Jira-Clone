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
                <img width='48' height='48' src="https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/64/000000/external-milk-coffee-shop-flatart-icons-lineal-color-flatarticons-1.png" />
                <span>
                    <p id='project-title'>Jira Clone</p>
                    <p id='project-type'>Software Project</p>
                </span>
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