import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KanbanIcon from './icons/Kanban';
import SettingsIcon from './icons/Settings';
import ReleaseIcon from './icons/Release';
import IssuesFiltersIcon from './icons/IssuesFilters';
import PagesIcon from './icons/Pages';
import ReportsIcon from './icons/Reports';
import ComponentsIcon from './icons/Components';

const Sidebar = ({name, category}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const kanbanTextStyle = (location.pathname === "/project") ? 'active-sidebar-text': '';
    const settingsTextStyle = (location.pathname === "/project/settings")? 'active-sidebar-text': '';;

    const catMap = new Map([['BUSINESS','Business'], ['MARKETING', 'Marketing'], ['SOFTWARE', 'Software']]);

    return (
        <div id='sidebar'>
            <div id='sidebar-title'>
                <img width='48' height='48' src="https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/64/000000/external-milk-coffee-shop-flatart-icons-lineal-color-flatarticons-1.png" alt='milk' />
                <span>
                    <div id='project-title'>{name}</div>
                    <p id='project-type'>{catMap.get(category)} Project</p>
                </span>
            </div>
            <div className={kanbanTextStyle + ' sidebar-item'} onClick={() => navigate('/project')}>
                <KanbanIcon />
                <p className={kanbanTextStyle}>Kanban Board</p>
            </div>
            <div className={settingsTextStyle + ' sidebar-item'} onClick={() => navigate('/project/settings')}>
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