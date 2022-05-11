import http from "./http-common";

const userLogin = async (loginCredentials) => {
    try {
        const res = await http.post("/api/users/login", loginCredentials, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(res);
        return res.data;
    } catch (error) {
        throw error;
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
};

const userRegistration = async (registrationData) => {
    try {
        const res = await http.post("/api/users/register", registrationData, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchAllIssues = async () => {
    try {
        const res = await http.get('api/issues');
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchAllIssueAssignees = async () => {
    try {
        const res = await http.get('api/issues/assignees');
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchIssue = async (id) => {
    try {
        const res = await http.get(`api/issues/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchUserInfo = async () => {
    try {
        const res = await http.get(`api/users/current`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const deleteIssue = async (id) => {
    try {
        const res = await http.delete(`api/issues/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchIssueAssignees = async (id) => {
    try {
        const res = await http.get(`api/users?issueId=${id}`);
        const assignees = res.data.map((obj) => obj.person_id);
        return assignees;
    } catch (error) {
        throw error;
    }
};

const fetchUsers = async () => {
    try {
        const res = await http.get('api/users');
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchComments = async (id) => {
    try {
        const res = await http.get(`api/comments?issueId=${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const fetchProjectInfo = async () => {
    try {
        const res = await http.get(`api/projects`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const createComment = async (data) => {
    try {
        const res = await http.post('api/comments', data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const createIssue = async (data) => {
    try {
        const res = await http.post('api/issues', data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const updateIssue = async (issueId, data) => {
    try {
        const res = await http.put(`/api/issues/${issueId}`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const updateProject = async (data) => {
    try {
        const res = await http.put('/api/projects/', data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (data) => {
    try {
        const res = await http.put('/api/users', data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export {
    userLogin,
    userLogout,
    userRegistration,
    fetchAllIssues,
    fetchAllIssueAssignees,
    fetchIssue,
    fetchUserInfo,
    fetchIssueAssignees,
    fetchUsers,
    fetchComments,
    fetchProjectInfo,
    createComment,
    createIssue,
    updateIssue,
    updateProject,
    updateUser,
    deleteIssue
};