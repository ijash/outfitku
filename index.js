let express = require('express');
require('express-async-errors');

let app = express();

require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));