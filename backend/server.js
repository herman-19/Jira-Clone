const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require("config");
const port = conf.get('serverConfig.port');
const session = require('express-session');

app.use(cors({
    origin: 'http://localhost:3000', // TODO: update allowed origin based on production environment
    credentials: true
}));
app.use(bodyParser.json());

// TODO: Set secure for https only. And revisit store type.
app.use(session({
    secret: conf.get('sessionSecret'),
    name: 'sessionID',
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15 // 15 minutes
    }
}));

// Define routes.
app.get('/', (req, res) => {
    res.send('API running...');
});
app.use('/api/users', require('./routes/api/users'));
app.use('/api/issues', require('./routes/api/issues'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/projects', require('./routes/api/projects'));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});