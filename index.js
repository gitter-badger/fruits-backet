
var express = require('express'),
	yaml = require('js-yaml'),
	fs = require('fs'),
	bunyan = require('bunyan'),
	turnip = require('turnip');

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

try {
	var config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
}
catch (e) {
	log.fatal('Couldn\'t read config.yml !!! Dying... painfully.');
	process.exit();
}

if(config.MAIN && config.MAIN.debug) log.addStream({level: 'debug', type: 'raw', stream: turnip});

log.debug('DEBUG ON');

log.addStream({path: (config.MAIN && config.MAIN.log) ? config.MAIN.log : 'fruits-basket.log'});
