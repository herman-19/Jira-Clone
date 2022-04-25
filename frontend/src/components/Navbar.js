import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateIssueModal from './CreateIssueModal';
import AtlassianLogo from './AtlassianLogoWhite';
import SearchIcon from './icons/Search';
import AddIcon from './icons/Add';
import SearchIssuePane from './SearchIssuePane';

const Navbar = () => {
    const [searchPaneDisplayed, setSearchPaneDisplayed] = useState(false);
    const location = useLocation();
    const onSearchClick = () => {
        // display pane for search
        setSearchPaneDisplayed(true);
    };
    const [displayModal, setDisplayModal] = useState(false);
    const toggleModal = () => {
        setDisplayModal(!displayModal);
    };
    const afterCreate = () => {
        setDisplayModal(!displayModal);
        if (displayModal && location.pathname === '/project') {
            // Refresh kanban view.
            window.location.reload();
        }
    };

    return (
        <div id='navbar-left'>
            <AtlassianLogo />
            <p id='navbar-left-item' onClick={onSearchClick} className='tooltip'><SearchIcon w='20' h='20' /><span className='tooltiptext'>Search issue</span></p>
            <p id='navbar-left-item' onClick={toggleModal} className='tooltip'><AddIcon /><span className='tooltiptext'>Create issue</span></p>
            <SearchIssuePane isDisplayed={searchPaneDisplayed} setIsDisplayed={setSearchPaneDisplayed}/>
            <CreateIssueModal isDiplayed={displayModal} toggleModal={toggleModal} afterCreate={afterCreate} />
        </div>
    );
};

export default Navbar;