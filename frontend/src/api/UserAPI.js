import http from "./http-common";

const userLogin = async (loginCredentials) => {
    try {
        const res = await http.post("/api/users/login", loginCredentials, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(res);
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const userLogout = async () => {
    try {
        const res = await http.get('api/users/logout');
        console.log(res);
        return true;
    } catch (error) {
        throw error;
    }
}

const userRegistration = async (registrationData) => {
    try {
        console.log(registrationData);
        return registrationData;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const fetchAllIssues = async () => {
    try {
        const res = await http.get('api/issues');
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

export {
    userLogin,
    userLogout,
    userRegistration,
    fetchAllIssues
};