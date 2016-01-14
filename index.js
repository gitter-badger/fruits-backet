
const express = require('express'),
	bunyan = require('bunyan'),
	https = require('https'),
	helmet = require('helmet'),
	turnip = require('turnip'),
	fs = require('fs'),
	yam = require('yam');

var app = express(),
	log = bunyan.createLogger({
		name: 'fruits-backet',
		streams:[
			{
				level: 'info',
				type: 'raw',
				stream: turnip
			}
		]
});

log.info('Starting');

var settings = yam(__dirname);

if (settings.err) {
	for (var i in settings.err) log.fatal(settings.err[i]);
	log.fatal('Dying... painfully.');
	process.exit();
}

if(settings.config.MAIN.debug) log.addStream({level: 'debug', type: 'raw', stream: turnip});

log.debug('DEBUG ON');

log.addStream({path: settings.config.MAIN.log});

app.use(helmet())
	.use('/public', express.static('public'));

const options = {
	key: fs.readFileSync(settings.config.HTTPS.key),
	passphrase: settings.config.HTTPS.pass,
  	cert: fs.readFileSync(settings.config.HTTPS.cert)
}

https.createServer(options, app).listen(settings.config.HTTPS.port);
