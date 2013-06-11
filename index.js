#!/usr/bin/env node

/*jshint node:true, indent:2, eqnull:true, laxcomma:true */

/**
 * Small script to automatically increment or set package version
 * Usage:
 *  $ v.js --help
 */

var program = require('commander')
  , clog = require('clog')
  , fs = require('fs')
  , version = require('./lib/version')
  , git = require('gitty')
  , async = require('async')
  , data
  , version
  , currentRepo
  , commitMessage;

program
  .version('0.0.1')
  .option('-M, --major', 'Auto increment mayor version and reset minor/patch')
  .option('-m, --minor', 'Auto increment minor version and reset patch')
  .option('-p, --patch', 'Auto increment patch')
  .option('-s, --set <M>.<m>.<p>', 'Manaully set version')
  .option('-c, --message <message>', 'The commit message')
  .parse(process.argv);

// update the version in the package.json
// TODO: remove program as param
version.update(program);

// do git stuff
currentRepo = git('.');

async.series({
  // commit message
  'message' : function(callback) {
    if(!program.message) {
      program.prompt('Please enter a commit message:', function(message){
        commitMessage = message;
        callback(null, commitMessage);
      });
    } else {
      commitMessage = program.message;
      callback(null, program.message);
    }
  },

  // add files
  'add_files' : function(callback) {
    currentRepo.add(["."], function(err, output) {
      if(err) {
        callback(err);
      } else {
        clog.info("Files added");
        callback(null, output);
      }
    });
  },

  // commit files
  'commit' : function(callback) {
    currentRepo.commit(commitMessage, function(err, output) {
      if(err) {
        callback(err);
      } else {
        clog.info("Files commited");
        callback(null, output);
      }      
    });
  },

  //remote push
  'remote_push': function(callback) {
    clog.info("Pushing files to remote");
    currentRepo.push("origin", "master", function(err, success) {
      if(err) {
        callback(err);
      } else {
        callback(null, success);
      }
    });
  }
}, function(err, results) {
  if(err) {
    clog.error("Can't complete task", err);
    process.exit(1);
  } else {
    clog.ok("Push done", results.remote_push);  
  }
});

