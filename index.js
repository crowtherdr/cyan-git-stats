var request = require('superagent');
var config = require('./config');
var debug = require('debug')('cyan-git-stats');

// Config properties
var personalAccessToken = config.personalAccessToken;

debug('token', personalAccessToken);

request.get('https://api.github.com/user')
    .auth(personalAccessToken, 'x-oauth-basic')
    .accept('application/vnd.github.v3+json')
    .set('Agent', 'tylerpeterson')
    .end(function (res) {
      if (res.ok) {
        debug('ok', JSON.stringify(res.body, null, '  '));
      } else {
        debug('not ok');
      }
    });