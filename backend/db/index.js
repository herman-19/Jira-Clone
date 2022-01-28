const conf = require('config');
const { Pool } = require('pg');
const format = require('pg-format');

// Create pool of connections.
const pool = new Pool({
    user: conf.get('dbConfig.user'),
    host: conf.get('dbConfig.host'),
    database: conf.get('dbConfig.database'),
    password: conf.get('dbConfig.password'),
    port: conf.get('dbConfig.port')
});

// QUERIES. TODO: Implement error handling for queries.

// Users.
const getUsers = async () => {
    const { rows } = await pool.query('SELECT person_id, name, email, image_s3_url FROM person');
    return rows;
};

const getUser = async (id) => {
    const { rows } = await pool.query('SELECT person_id, name, email, image_s3_url FROM person WHERE person_id = $1', [id]);
    return rows[0];
};

const deleteUser = async (id) => {
    const { rows } = await pool.query('DELETE FROM person WHERE person_id = $1 RETURNING *', [id]);
    return rows[0];
};

const createUser = async (name, email, password) => {
    // TODO: Hash password prior to storage.
    // Also add error-handling in case user already exists.
    // In this case, email address must be unique.
    const { rows } = await pool.query('INSERT INTO person(name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
    return rows[0];
};

const updateUser = async (id, name, password) => {
    // TODO: Hash password prior to storage.
    const { rows } = await pool.query('UPDATE person SET name = $2, password = $3 WHERE person_id = $1 RETURNING *', [id, name, password]);
    return rows[0];
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

const deleteIssue = async (id) => {
    const { rows } = await pool.query('DELETE FROM issue WHERE issue_id = $1 RETURNING *', [id]);
    return rows[0];
};

const createIssue = async (issueData) => {
    const {
        type,
        status,
        priority,
        title,
        description,
        reporter_id,
        created_timestamp,
        last_updated_timestamp,
        assigneeIDs
    } = issueData;
    // TODO: Determine if any form of validation is necessary.
    let { rows } = await pool.query('INSERT INTO issue(type, status, priority, title, description, reporter_id, created_timestamp, last_updated_timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [type, status, priority, title, description, reporter_id, created_timestamp, last_updated_timestamp]);

    // Create entry in bridge table that stores assignee/issue data.
    let issueId = rows[0].issue_id;
    let issueAssignees = [];
    for (let assigneedID of assigneeIDs) {
        issueAssignees.push([issueId, assigneedID]);
    }

    await pool.query(format('INSERT INTO issue_assignee(issue_id, person_id) VALUES %L', issueAssignees), []);

    return rows[0];
};

const updateIssue = async (issueId, issueData) => {
    const {
        type,
        status,
        priority,
        title,
        description,
        reporter_id,
        created_timestamp,
        last_updated_timestamp,
        assigneeIDs
    } = issueData;

    // Update record in issue table.
    const { rows } = await pool.query('UPDATE issue SET type = $2, status = $3, priority = $4, title = $5, description = $6, reporter_id = $7, created_timestamp = $8, last_updated_timestamp = $9 WHERE issue_id = $1 RETURNING *', [issueId, type, status, priority, title, description, reporter_id, created_timestamp, last_updated_timestamp]);

    // TODO: Research for a better way to update bridge table.
    // For now, simply remove records with current issue ID and 
    // then insert new <issueID, userID> pair entry.
    let issueAssignees = [];
    for (let assigneedID of assigneeIDs) {
        issueAssignees.push([issueId, assigneedID]);
    }
    await pool.query('DELETE FROM issue_assignee WHERE issue_id = $1', [issueId]);
    await pool.query(format('INSERT INTO issue_assignee(issue_id, person_id) VALUES %L', issueAssignees), []);

    return rows[0];
};

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    createUser,
    updateUser,
    getIssues,
    getIssue,
    deleteIssue,
    createIssue,
    updateIssue
};