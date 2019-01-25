let express = require('express');
require('express-async-errors');
require('./startup/db')();

let app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));