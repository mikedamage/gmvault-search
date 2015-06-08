/* jshint node: true */

'use strict';

var _          = require('lodash');
var path       = require('path');
var fs         = require('fs');
var events     = require('events');
var util       = require('util');
var io         = require('q-io');
var Finder     = require('node-find-files');
var MailParser = require('mailparser').MailParser;

var defaults = {
  outputType: null,
  outputFile: null,
  parse: false
};

var GmvaultSearch = function GmvaultSearch(dir, criteria, options) {
  if (!_.isString(dir) || !fs.existsSync(dir)) {
    throw new Error('dir must be a string pointing to an existing directory');
  }

  if (!_.isObject(criteria)) {
    throw new Error('criteria must be an object');
  }

  var self            = this;
  this.dir            = dir;
  this.criteria       = criteria;
  this.options        = _.assign({}, defaults, options);
  this.matches        = [];
  this.filesProcessed = 0;
  this.fileMatcher    = new Finder({
    rootFolder: dir,
    filterFunction: function(file, stat) {
      return (/\.meta$/).test(file);
    }
  });

  this.fileMatcher.on('match', function(strPath, stat) {
    io.read(strPath).then(function(text) {
      self.filesProcessed++;
      return JSON.parse(text);
    }).then(function(json) {
      if (self.checkCriteria(json)) {
        self.emit('match', json);
        self.matches.push(json);
      }
    });
  });

  this.fileMatcher.on('complete', function() {
    self.emit('done');
  });

  events.EventEmitter.call(this);
};

util.inherits(GmvaultSearch, events.EventEmitter);

GmvaultSearch.prototype.start = function() {
  
};

GmvaultSearch.prototype.checkCriteria = function(meta) {
  
};

module.exports = GmvaultSearch;
