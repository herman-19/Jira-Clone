const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require('config');
const port = conf.get('serverConfig.port');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

app.use(cors({
    origin: 'http://localhost:3000', // TODO: update allowed origin based on production environment
    credentials: true
}));
app.use(bodyParser.json());

// TODO: Set secure for https only.
app.use(session({
    secret: conf.get('sessionSecret'),
    name: 'sessionID',
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // 60 minutes
    },
    store: new redisStore({
        host: conf.get('redis.host'),
        port: conf.get('redis.port'),
        client: redisClient
    })
}));

// Define routes.
app.get('/', (req, res) => {
    res.send('API running...');
});
app.use('/api/users', require('./routes/api/users'));
app.use('/api/issues', require('./routes/api/issues'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/projects', require('./routes/api/projects'));
app.use('/api/uploads', require('./routes/api/uploads'));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});