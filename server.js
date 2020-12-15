const express = require('express');
const chalk = require('chalk');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost'

require('./routes').routes(app);
app.listen(port, host, () => {
  console.log(
    chalk.black.bgCyanBright(
      " Server is listening ",
      chalk.underline(`http://${host}:${port} `)
    )
  );
});