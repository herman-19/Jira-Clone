import React from 'react';
import AtlassianLogo from './AtlassianLogoWhite';

const Navbar = () => {
    return (
        <div id='navbar-left'>
            <AtlassianLogo />
            <p id='navbar-left-item'>SEARCH</p>
            <h2 id='navbar-left-item'>+</h2>
        </div>
    );
};

export default Navbar;