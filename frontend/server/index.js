module.exports = function(app) {
  var globSync   = require('glob').sync;
  var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);
  var bodyParser = require('body-parser');

  // Log proxy requests
  var morgan  = require('morgan');
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(morgan('dev'));

  function usingProxy() {
    return !!process.argv.filter(function (arg) {
        return arg.indexOf('--proxy') === 0;
    }).length;
  }

  if (usingProxy()) { return; }

  mocks.forEach(function(route) { route(app); });
  proxies.forEach(function(route) { route(app); });

};
