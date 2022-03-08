import React from 'react';
import AtlassianLogo from './AtlassianLogoWhite';
import SearchIcon from './icons/Search';
import AddIcon from './icons/Add';

const Navbar = () => {
    return (
        <div id='navbar-left'>
            <AtlassianLogo />
            <p id='navbar-left-item'><SearchIcon w='20' h='20' /></p>
            <p id='navbar-left-item'><AddIcon /></p>
        </div>
    );
};

export default Navbar;