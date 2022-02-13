import http from "./http-common";

const userLogin = async (loginCredentials) => {
    try {
        const res = await http.post("/api/users/login", loginCredentials, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        const errMsg = error.response.data.errors[0].msg;
        throw errMsg;
    }
};

export { userLogin };