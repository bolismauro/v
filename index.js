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
  , data
  , version
  , currentRepo;

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
currentRepo.add([".",], undefined, true);
currentRepo.commit(program.message, function(err, output) {
  if(err) {
    clog.error(err);
    process.exit(1);
  }
  
  clog.info("Pushing commit");
  currentRepo.push("origin", "master", function(err, success) {
    if(err) {
      clog.error(err);
      process.exit(1);
    } else {
      clog.ok("Push done", success);
    }
  });

});




