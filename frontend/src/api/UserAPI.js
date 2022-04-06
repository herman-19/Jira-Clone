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

const fetchAllIssueAssignees = async () => {
    try {
        const res = await http.get('api/issues/assignees');
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
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

const fetchProjectInfo = async () => {
    try {
        const res = await http.get(`api/projects`);
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
}

const createComment = async (data) => {
    try {
        const res = await http.post('api/comments', data);
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

const updateProject = async (data) => {
    try {
        const res = await http.put('/api/projects/', data);
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
    fetchAllIssueAssignees,
    fetchIssue,
    fetchIssueAssignees,
    fetchUsers,
    fetchComments,
    fetchProjectInfo,
    createComment,
    updateIssue,
    updateProject
};