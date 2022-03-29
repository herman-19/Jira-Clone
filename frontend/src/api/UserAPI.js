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

const fetchIssue = async (id) => {
    try {
        const res = await http.get(`api/issues/${id}`);
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const fetchIssueAssignees = async (id) => {
    try {
        const res = await http.get(`api/users?issueId=${id}`);
        const assignees = res.data.map((obj) => obj.person_id);
        return assignees;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const fetchUsers = async () => {
    try {
        const res = await http.get('api/users');
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const fetchComments = async (id) => {
    try {
        const res = await http.get(`api/comments?issueId=${id}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const createComment = async (data) => {
    try {
        const res = await http.post('api/comments', data);
        console.log(res.data);
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
}

const updateIssue = async (issueId, data) => {
    try {
        const res = await http.put(`/api/issues/${issueId}`, data);
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
    fetchAllIssues,
    fetchIssue,
    fetchIssueAssignees,
    fetchUsers,
    fetchComments,
    createComment,
    updateIssue
};