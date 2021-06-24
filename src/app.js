const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const findRemoveSync = require('find-remove')
const CronJob = require('cron').CronJob;

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(`${__dirname}../../public`));
app.use('/css', express.static(`${__dirname}public/css`));
app.use('/js', express.static(`${__dirname}public/js`));
app.use('/img', express.static(`${__dirname}public/img`));

// Set Templating Engine
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index'), { siteName: process.env.SITE_NAME };
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Delete old demos every two days.
console.log('Before job instantiation');
const deleteCron = new CronJob('* * * * *', function() {
findRemoveSync(__dirname + "..\public\demos", {age: {seconds: 10}, extensions: '.dem', limit: 200})
}, null, true, 'America/Los_Angeles');
console.log(__dirname + '..\public\demos');
deleteCron.start();
console.log('Job Started');

module.exports = app;

// 00 00 */2 * * every 2 days