var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      callback(null);
    } else {
      callback(data.split('\n'), null);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      callback(null);
    } else {
      var list = data.split('\n');
      if (list.indexOf(url) === - 1) {
        callback(false, null);
      } else {
        callback(true, null);
      }
    }
  });

};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err, data) {
    if (err) {
      console.log('Fail to write to List');
      callback(err, null);
    } else {
      console.log('Write to List Success', data);
      callback(null, data);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
    if (!exists) {
      callback(false);
      //console.log(false)
    } else {
      callback(exists);
    }
  });
};

//this is a hack using Sync system 
exports.isArchived = function(url) {
  if (fs.existsSync(exports.paths.archivedSites + '/' + url)) {
    return true;
  } else {
    return false;
  }
};
exports.downloadUrls = function(urls) {
  console.log('this is the passed it urls ', urls);
  urls.forEach(function(item){
    console.log(item)
    exports.isUrlArchived(item, function(data) {
      exports.isUrlInList(item, function() {
        //console.log('found new sites', item); 
        //fs.mkdir(exports.paths.archivedSites + '/' + item, function() {
          http.get('http://' + item, function(response) {
          // Continuously update stream with data
          var body = '';
          response.on('data', function(d) {
              body += d;
          });
            response.on('end', function() {
                // Data reception is done, do whatever with it!
              fs.writeFile(exports.paths.archivedSites + '/' + item, body, function() {
                console.log('url downloaded');
              });
            });
          });
        //});
      });
    });
  });
};


  // fs.readFile(exports.paths.archivedSites, 'utf8', function(err, data) {
  //   if (err) {
  //     console.log('cant download url', err);
  //   } else {
  //     console.log('what is data ', data);
  //     var ourUrls = data.split('\n');
  //     console.log('ourUrls is', ourUrls);
  //     ourUrls.forEach(function(url) {
  //       if (!exports.isArchived(url)) {
  //         fs.mkdir(exports.paths.archivedSites + '/' + url, function() {
  //           http.get('http://' + url, function(err, res, body) {
  //             fs.appendFile(exports.paths.archivedSites + '/' + url + '/index.html', body, function() {
  //               console.log(exports.paths.archivedSites + '/' + url + '/index.html');
  //               console.log('url downloaded');
  //             });
  //           });
  //         });
  //       }
  //     });
  //   }
  // });
