const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require("config");
const port = conf.get('serverConfig.port')

app.use(cors());
app.use(bodyParser.json());

// Define routes.
app.get('/', (req, res) => {
    res.send('API running...');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});