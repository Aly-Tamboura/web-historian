var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
//var fetchers = require('../workers/htmlfetcher');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};
var encoding = {encoding: 'utf8'}
exports.serveAssets = function(res, asset, callback) {
  fs.readFile(archive.paths.siteAssets + asset, encoding, function(err, data) {
    if (err) {
     callback(err, null)
    } else {
      callback(null, data)
    }
  });

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

};



// As you progress, keep thinking about what helper functions you can put here!
