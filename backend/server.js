const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const conf = require("config");
const port = conf.get('serverConfig.port')

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Server is listening...');
});