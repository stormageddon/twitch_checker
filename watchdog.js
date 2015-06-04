'use strict'

var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Tray = require('tray');
var request = require('request');
var async = require('async');

// Get a users list of followed
var followed = [];
var currStreamers = [];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var appIcon = null;

var window = global;
window.$ = window.jQuery = require('./node_modules/jquery/dist/jquery.min.js');
console.log(window.jQuery);

// Need flash to display Twitch for now
app.commandLine.appendSwitch('/Applications/Google Chrome.app/Contents/Versions/43.0.2357.81/Google Chrome Framework.framework/Internet Plug-Ins/PepperFlash/PepperFlashPlayer.plugin');

// Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '17.0.0.188');


var getFollowed = function(username, cb) {
  //curl -H 'Accept: application/vnd.twitchtv.v3+json' \
// -X GET https://api.twitch.tv/kraken/users/test_user1/follows/channels
  followed = [];
  request('https://api.twitch.tv/kraken/users/' + username + '/follows/channels', function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.follows.length; i++) {
        var streamer = data.follows[i];
        followed.push(streamer.channel.display_name);
      }
      cb();
    }
  });
}

var getChannelStatus = function(channelName, callback) {
// curl -H 'Accept: application/vnd.twitchtv.v3+json' \
// -X GET https://api.twitch.tv/kraken/streams/test_channel
  console.log('channelname:',channelName,callback);
  request('https://api.twitch.tv/kraken/streams/' + channelName, function(error, response, body) {
    if (!error) {
      if( JSON.parse(body).stream != null ) {
        console.log('%s is online', channelName);
        currStreamers.push(channelName);
      }
      console.log('what?');
      callback();
    }
    else {
      console.log('error:',error);
    }
  });
}

if (process.argv.length < 3) {
  console.log('usage: node twitch_checker.js [twitch_username]')
  process.exit(1);
}

var args = process.argv.slice(2);

var contextMenu = {} // We don't want a new menu every time

var minutes = .5, the_interval = minutes * 60 * 1000;
setInterval(function() {
 tick();
}, the_interval);

var tick = function() {
 console.log("Checking for new streamers");
  getFollowed(args[0], function() {
    console.log('========= Channels Online =========');
    currStreamers = [];
    async.each(followed, getChannelStatus, function(err) {
      if(!err) {

        var selectedStreamer = null;
        var labels = [];
        for (var i = 0; i < currStreamers.length; i++) {
          labels.push({ label: currStreamers[i], type: 'normal', click: function(streamerName) { openStream(streamerName.label)}.bind(currStreamers[i]) });
        }

        appIcon.setToolTip('Online streamers.');

        console.log('currstreamers length:',currStreamers.length);
        if (currStreamers.length === 0) {
          console.log('set grey');
          appIcon.setImage('/Users/Mike/Downloads/dota2_gray.jpg');
          labels.push({label: 'No live streams', type: 'normal'});
        }
        else {
          console.log('set not grey');
          appIcon.setImage('/Users/Mike/Downloads/dota2.png');
        }
        labels.push({ label: 'Commands', type: 'separator' });
        labels.push({ label: 'Quit', type: 'normal', click: close });
        contextMenu = Menu.buildFromTemplate(labels);
        appIcon.setContextMenu(contextMenu);
      }
      else {
        console.log('err:',err);
      }
    });
  });
}

var streamWindow = {};

var openStream = function(streamerName) {
  console.log("open stream", streamerName);
  streamWindow = new BrowserWindow({width: 800, height: 600, "node-integration": false, 'web-preferences': {'plugins': true}} );
  streamWindow.loadUrl('http://www.twitch.tv/' + streamerName);
  streamWindow.on('closed', function() {
    streamWindow = null;
  });
}

app.on('ready', function() {
  appIcon = new Tray('/Users/Mike/Downloads/dota2_gray.jpg'); // Only need one Tray icon
  tick();
});

var close = function() {
  console.log('close app');
  streamWindow = null;
  appIcon.destroy();
  process.exit(0);
}