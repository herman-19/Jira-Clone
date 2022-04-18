import React, { useState } from 'react';
import AtlassianLogo from './AtlassianLogoWhite';
import SearchIcon from './icons/Search';
import AddIcon from './icons/Add';
import SearchIssuePane from './SearchIssuePane';

const Navbar = () => {
    const [searchPaneDisplayed, setSearchPaneDisplayed] = useState(false);
    const onSearchClick = () => {
        // display pane for search
        setSearchPaneDisplayed(true);
    };

    return (
        <div id='navbar-left'>
            <AtlassianLogo />
            <p id='navbar-left-item' onClick={onSearchClick} className='tooltip'><SearchIcon w='20' h='20' /><span className='tooltiptext'>Search issue</span></p>
            <p id='navbar-left-item' className='tooltip'><AddIcon /><span className='tooltiptext'>Create issue</span></p>
            <SearchIssuePane isDisplayed={searchPaneDisplayed} setIsDisplayed={setSearchPaneDisplayed}/>
        </div>
    );
};

export default Navbar;