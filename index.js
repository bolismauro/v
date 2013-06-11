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
  , data
  , version;

program
  .version('0.0.1')
  .option('-M, --major', 'Auto increment mayor version and reset minor/patch')
  .option('-m, --minor', 'Auto increment minor version and reset patch')
  .option('-p, --patch', 'Auto increment patch')
  .option('-s, --set <M>.<m>.<p>', 'Manaully set version')
  .parse(process.argv);


data = JSON.parse(fs.readFileSync('package.json'));

clog.info('Current version is', data.version);

if (program.set != null) {
  data.version = program.set;
  clog.ok('Version set to', data.version);
  
} else {
  if (data.version == null) {
    clog.error('Error: please set an initial version using --set');
    process.exit(1);
    
  } else {
    
    version = data.version.split('.');
    
    if (program.major != null) {
      version[0] = parseInt(version[0], 10) + 1;
      version[1] = 0;
      version[2] = 0;
    } else {
      if (program.minor != null) {
        version[1] = parseInt(version[1], 10) + 1;
        version[2] = 0;
      } else {
        version[2] = parseInt(version[2], 10) + 1;
      }
    }
    
    
    data.version = version.join('.');
    clog.ok('Version set to', data.version);
  }
}

fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
