const conf = require('config');
const { Pool } = require('pg');
const format = require('pg-format');
const bcrypt = require('bcryptjs');

// Create pool of connections.
const pool = new Pool({
    user: conf.get('dbConfig.user'),
    host: conf.get('dbConfig.host'),
    database: conf.get('dbConfig.database'),
    password: conf.get('dbConfig.password'),
    port: conf.get('dbConfig.port')
});

// QUERIES.

// Users.
const getUsers = async () => {
    const { rows } = await pool.query('SELECT person_id, name, email, image_s3_url FROM person');
    return rows;
};

const getUser = async (id) => {
    const { rows } = await pool.query('SELECT person_id, name, email, image_s3_url FROM person WHERE person_id = $1', [id]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM person WHERE email = $1', [email]);
    return rows[0];
};

const deleteUser = async (id) => {
    const { rows } = await pool.query('DELETE FROM person WHERE person_id = $1 RETURNING *', [id]);
    return rows[0];
};

const createUser = async (name, email, password) => {
    const { rows } = await pool.query('INSERT INTO person(name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
    return rows[0];
};

const updateUser = async (id, name, password) => {
    let row;
    if (name && password) {
        // Hash password before storing.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const res = await pool.query('UPDATE person SET name = $2, password = $3 WHERE person_id = $1 RETURNING name, email, image_s3_url', [id, name, hashedPassword]);
        row = res.rows[0];
    } else if (!name) {
        // Only password will be updated.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const res = await pool.query('UPDATE person SET password = $2 WHERE person_id = $1 RETURNING name, email, image_s3_url', [id, hashedPassword]);
        row = res.rows[0];
    } else {
        // Only name will be updated.
        const res = await pool.query('UPDATE person SET name = $2 WHERE person_id = $1 RETURNING name, email, image_s3_url', [id, name]);
        row = res.rows[0];
    }
    return row;
};

// Issues.
const getIssues = async () => {
    const { rows } = await pool.query('SELECT * FROM issue');
    return rows;
};

const getIssue = async (id) => {
    const { rows } = await pool.query('SELECT * FROM issue WHERE issue_id = $1', [id]);
    return rows[0];
};

const getIssueByUserId = async (userId) => {
    const { rows } = await pool.query(
        'SELECT ia.issue_id, i.type, i.status, i.priority, i.title, i.description, i.reporter_id, i.created_at, i.last_updated_at \
         FROM issue_assignee AS ia \
         INNER JOIN issue AS i \
         ON ia.issue_id = i.issue_id \
         WHERE person_id = $1', [userId]);
    return rows;
};

const deleteIssue = async (id) => {
    const { rows } = await pool.query('DELETE FROM issue WHERE issue_id = $1 RETURNING *', [id]);
    return rows[0];
};

const createIssue = async (issueData) => {
    // Creating an issue consists of two steps:
    //  1. inserting to the person table.
    //  2. inserting to issue_assignee bridge table.
    // Since we are updating different tables, this calls
    // for a transaction to ensure both are updated,
    // or neither is updated in case of error.

    // PostgreSQL isolates a transaction to individual clients.
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const {
            type,
            status,
            priority,
            title,
            description,
            reporterId,
            assigneeIDs
        } = issueData;

        let { rows } = await client.query('INSERT INTO issue(type, status, priority, title, description, reporter_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [type, status, priority, title, description, reporterId]);

        // Create entry in bridge table that stores assignee/issue data.
        let issueId = rows[0].issue_id;
        let issueAssignees = [];
        for (let assigneedID of assigneeIDs) {
            issueAssignees.push([issueId, assigneedID]);
        }
        await client.query(format('INSERT INTO issue_assignee(issue_id, person_id) VALUES %L', issueAssignees), []);

        await client.query('COMMIT');
        return rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateIssue = async (issueId, issueData) => {
    // Updating an issue consists of two steps:
    //  1. updating the person table.
    //  2. updating issue_assignee bridge table.
    // Since we are updating different tables, this calls
    // for a transaction to ensure all-or-nothing.

    // PostgreSQL isolates a transaction to individual clients.
    const client = await pool.connect();
    const query = constructUpdateIssueQuery(issueId, issueData);

    // Extract list of values from issueData.
    // Skip assigneeIDs if provided since this is used only for
    // updating bridge table.
    const values = Object.keys(issueData).filter(key => key !== "assigneeIDs").map(key => issueData[key]);

    try {
        await client.query('BEGIN');

        // Update record in issue table.
        const { rows } = await client.query(query, values);

        // Update bridge table if assignees were updated.
        const { assigneeIDs } = issueData;
        if (assigneeIDs) {
            let issueAssignees = [];
            for (let assigneedID of assigneeIDs) {
                issueAssignees.push([issueId, assigneedID]);
            }
            await client.query('DELETE FROM issue_assignee WHERE issue_id = $1', [issueId]);
            await client.query(format('INSERT INTO issue_assignee(issue_id, person_id) VALUES %L', issueAssignees), []);
        }

        await client.query('COMMIT');
        return rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        console.log('Releasing client -- updateIssue');
        client.release();
    }
};

const constructUpdateIssueQuery = (issueId, cols) => {
    // Setup static beginning of query
    const query = ['UPDATE issue'];
    query.push('SET');

    // Create list storing each set command
    // and assigning a number value for parameterized query
    const set = [];
    Object.keys(cols).forEach((key, i) => {
        // Skip assigneeIDs list, since it's
        // used to update the bridge table only.
        if (key !== 'assigneeIDs') {
            set.push(key + ' = $' + (i + 1));
        }
    });
    query.push(set.join(', '));

    // Add the WHERE statement to look up by id
    query.push('WHERE issue_id = ' + issueId);
    query.push('RETURNING *');

    // Return a complete query string
    return query.join(' ');
};

// Comments.
const getComments = async () => {
    const { rows } = await pool.query('SELECT * FROM comment');
    return rows;
};

const getComment = async (id) => {
    const { rows } = await pool.query('SELECT * FROM comment WHERE comment_id = $1', [id]);
    return rows[0];
};

const deleteComment = async (id) => {
    const { rows } = await pool.query('DELETE FROM comment WHERE comment_id = $1 RETURNING *', [id]);
    return rows[0];
};

const createComment = async (commentData) => {
    const {
        personId,
        issueId,
        content
    } = commentData;

    const { rows } = await pool.query('INSERT INTO comment(person_id, issue_id, content) VALUES ($1, $2, $3) RETURNING *', [personId, issueId, content]);
    return rows[0];
};

const updateComment = async (commentId, content) => {
    const { rows } = await pool.query('UPDATE comment SET content = $2 WHERE comment_id = $1 RETURNING *', [commentId, content]);
    return rows[0];
};

// Projects.
const getProject = async () => {
    const { rows } = await pool.query('SELECT * FROM project');

    // Only one project.
    return rows[0];
};

const updateProject = async (projectId, projectData) => {
    const {
        name,
        url,
        category,
        description
    } = projectData;

    const { rows } = await pool.query('UPDATE project SET name = $2, url = $3, category = $4, description = $5 WHERE project_id = $1 RETURNING *', [projectId, name, url, category, description]);
    return rows[0];
};

module.exports = {
    getUsers,
    getUser,
    getUserByEmail,
    deleteUser,
    createUser,
    updateUser,
    getIssues,
    getIssue,
    getIssueByUserId,
    deleteIssue,
    createIssue,
    updateIssue,
    getComments,
    getComment,
    deleteComment,
    createComment,
    updateComment,
    getProject,
    updateProject
};