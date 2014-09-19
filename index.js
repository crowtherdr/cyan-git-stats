var request = require('superagent');
var config = require('./config');
var debug = require('debug')('cyan-git-stats');

// Config properties
var personalAccessToken = config.personalAccessToken;
var team = config.teams[config.teams._order[0]];
var repos = team.repos;
var agent = config.agent;


function nextRepoStats() {
  var repo = repos.shift();
  debug('repo', repo);

  request.get('https://api.github.com/repos/' + repo + '/stats/contributors')
      .auth(personalAccessToken, 'x-oauth-basic')
      .accept('application/vnd.github.v3+json')
      .set('Agent', agent)
      .end(function (res) {
        if (res.ok) {
          // debug('ok', JSON.stringify(res.body, null, '  '));
          res.body.forEach(function (authorStatistics) {
            var login = authorStatistics.author.login;
            if (team.users.indexOf(login) === -1) {
              return;
            }
            debug('author: ', login, authorStatistics.total);
            var commits = 0;
            var additions = 0
            var net = 0;
            var weeks = authorStatistics.weeks;

            if (weeks.length > 12) {
              weeks = weeks.slice(-12);
            }

            weeks.forEach(function (week) {
              commits += week.c;
              additions += week.a;
              net += week.a - week.d;
            });
            debug('commits:', commits, 'additions:', additions, 'net:', net);
          })
          nextRepoStats();
        } else {
          debug('not ok');
        }
      });
}

nextRepoStats();