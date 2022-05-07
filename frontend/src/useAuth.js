// Hook which enables any component to get the current auth state
// and re-render if it changes.
import React, { useState, createContext, useContext } from 'react';
import { userLogin, userLogout, userRegistration } from './api/UserAPI';

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
    const localStorageMyUserId = JSON.parse(localStorage.getItem('myUserId'));
    const [loggedIn, setLoggedIn] = useState(localStorageVal);
    const [myUserId, setMyUserId] = useState(localStorageMyUserId);

    const login = async (loginCredentials, cb) => {
        try {
            const data = await userLogin(loginCredentials);
            setLoggedIn(true);
            setMyUserId(data.person_id);
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('myUserId', data.person_id);
            cb();
        } catch (error) {
            throw (error);
        }
    };

    const register = async (registerInfo, cb) => {
        try {
            const data = await userRegistration(registerInfo);
            setLoggedIn(true);
            setMyUserId(data.person_id);
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('myUserId', data.person_id);
            cb();
        } catch (error) {
            console.log(error.data);
            throw (error);
        }
    };

    const logout = async () => {
        try {
            await userLogout();
            setLoggedIn(false);
            localStorage.setItem('loggedIn', false);
        } catch (error) {
            throw (error);
        }
    };

    const unauthorizedLogout = async (cb) => {
        try {
            setLoggedIn(false);
            localStorage.setItem('loggedIn', false);
            cb();
        } catch (error) {
            throw (error);
        }
    };

    return {
        loggedIn,
        myUserId,
        login,
        register,
        logout,
        unauthorizedLogout
    };
};

export {
    useAuth,
    useProvideAuth,
    ProvideAuth
};