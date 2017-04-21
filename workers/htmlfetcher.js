// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
//var server = require('../web/basic-server.js')
var helpers = require('../helpers/archive-helpers.js');
var path = require('path');
 //console.log(helpers);
exports.fetcher = function() {


  helpers.readListOfUrls(function(data) {
   helpers.downloadUrls(data);
  })

};

//ghetto cron 
setInterval(function() {
  exports.fetcher()
}, 7000000);
