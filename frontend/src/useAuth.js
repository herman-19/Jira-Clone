// Hook which enables any component to get the current auth state
// and re-render if it changes.
import React, { useState, createContext, useContext } from 'react';
import { userLogin, userLogout } from './api/UserAPI';

const authContext = createContext();
const useAuth = () => {
    return useContext(authContext);
};

const ProvideAuth = ({ children }) => {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
};

// Hook that helps determine whether user is logged in or not.
// Wraps functions and uses context 
const useProvideAuth = () => {
    // Use local storage to persist loggedIn value after a refresh.
    const localStorageVal = JSON.parse(localStorage.getItem('loggedIn'));
    const [loggedIn, setLoggedIn] = useState(localStorageVal);

    const login = async (loginCredentials, cb) => {
        try {
            const data = await userLogin(loginCredentials);
            setLoggedIn(true);
            localStorage.setItem('loggedIn', true);
            cb();
        } catch (error) {
            throw (error);
        }
    };

    const logout = async (cb) => {
        try {
            const data = await userLogout();
            setLoggedIn(false);
            localStorage.setItem('loggedIn', false);
            cb();
        } catch (error) {
            throw (error);
        }
    };

    return {
        loggedIn,
        login,
        logout
    };
};

export {
    useAuth,
    useProvideAuth,
    ProvideAuth
};