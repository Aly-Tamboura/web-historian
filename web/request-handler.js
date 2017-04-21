var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var helpers = require('./http-helpers.js');
var urls = require('url'); //need this file to parse url npm install url --save
// require more modules/folders here!
//var publicPath = path.join(__dirname, 'public');
var routes = {
  'GET': function(req, res) {
    var ourUrl = urls.parse(req.url);
    var url = ourUrl.path;

    if (url === '/') {
      url = '/index.html';
    }

    //console.log('requst type ', req.method, 'reqest url ', req.url);

    fs.readFile(archive.paths.siteAssets + url, 'utf8', function(err, data) {
      if (err) {
        fs.readFile(archive.paths.archivedSites + url, 'utf8', function(err, data) {
          if (err) {
            console.log('Not in archive sites');
            res.writeHead(404, helpers.headers);
            res.end();
          } else {
            res.writeHead(200, {'Content-Type': 'text/html'}); //headers come from helpers' file
            res.write(data);
            res.end();
          }
        });
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'}); //headers come from helpers' file
        res.write(data);
        res.end();
      }
    });

  },
  'POST': function(req, res) {
    console.log('POST REQUEST');
    var body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      var url = body.split('=')[1];
      fs.appendFile(archive.paths.list, url + '\n', function(err) {
        if (err) {
          console.log('didn\'t write to file ', err);
        } else {
          console.log('The file was written');
          helpers.serveAssets(res, '/index.html', function(err, data) {
            console.log('this is out file' , data)  
            // res.write(data);
            res.writeHead(302, {'Content-Type': 'text/html'});
            res.end(data);
          });
        }
      });
    });
  },
  'OPTIONS': function(req, res) {
    console.log('OPTIONS REQUEST');
  }
};

exports.handleRequest = function (req, res) {
  if (routes[req.method]) {
    routes[req.method](req, res);
  }
};
