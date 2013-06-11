/*jshint node:true, indent:2, eqnull:true, laxcomma:true */

/**
 * Version updating library
 */

var clog = require('clog')
  , fs = require('fs')
  , updateFn;

/**
 * This function is used to update the current version of the package.json
 * @param  commander program represent the user input
 */
exports.update = updateFn = function(program) {
  var data
    , version;

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
};

