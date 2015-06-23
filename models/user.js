// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';
  var Q, User, request;

  request = require('request');

  Q = require('q');

  User = (function() {
    function User(username) {
      this.username = username;
      this.followed = [];
    }

    User.prototype.getFollowed = function() {
      var deferred;
      console.log('getting followed');
      deferred = Q.defer();
      request("https://api.twitch.tv/kraken/users/" + this.username + "/follows/channels", function(error, response, body) {
        var data, streamer;
        if (!error) {
          data = JSON.parse(body);
          console.log('data:', data);
          if (data) {
            this.followed = (function() {
              var i, len, ref, results;
              ref = data.follows;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                streamer = ref[i];
                results.push({
                  streamName: streamer.channel.name,
                  displayName: streamer.channel.display_name
                });
              }
              return results;
            })();
            return deferred.resolve(this.followed);
          }
        } else {
          return deferred.reject(new Error(error));
        }
      });
      return deferred.promise;
    };

    return User;

  })();

  module.exports = User;

}).call(this);
