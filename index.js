var request = require('superagent');
var config = require('./config');
var debug = require('debug')('cyan-git-stats');

var personalAccessToken = config.personalAccessToken;

debug('token', personalAccessToken);