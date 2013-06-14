/*jshint node:true, indent:2, eqnull:true, laxcomma:true */

/**
 * Version updating library
 */

var clog = require('clog')
  , fs = require('fs');

/** Return the current version stored in the package.json */
exports.getCurrentVersion = function() {
  var data = JSON.parse(fs.readFileSync('package.json'));  
  return data.version;
}

/**
 * This function is used to update the current version of the package.json
 * @param  {String} action  The operation to do. 
                            S for set the version (version param is required). 
                            M to increase the major version.
                            m to increase the minor version.
                            p to increase the patch version

 * @param  {[type]} version optional, the version to set (S value in action parameter)
 */
exports.update = function(action, version) {
  var data
    , version;

  data = JSON.parse(fs.readFileSync('package.json'));

  clog.info('Current version is', data.version);

  if (action === "S") {
    data.version = version;
    clog.ok('Version set to', data.version);
    
  } else {
    if (data.version == null) {
      clog.error('Error: please set an initial version using --set');
      process.exit(1);
      
    } else {
      
      version = data.version.split('.');
      
      if (action === "M") {
        version[0] = parseInt(version[0], 10) + 1;
        version[1] = 0;
        version[2] = 0;
      } else {
        if (action === "m") {
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

/**
 * This function is used to update the file history.md which contains
 * the history of all patch of the current version
 * @param  {string} message - the message to log
 */
exports.writeHistory = function(message) {
  var content
    , messageToAppend
    , dateFormat = require('dateformat');

  try {
    content = fs.readFileSync('HISTORY.md');
  } catch(e) {
    // file doesn't exists
    content = "Version history\n=============";
  }
  console.log()
  messageToAppend = dateFormat(new Date(), "d mmmm yyyy, h:MM:ss") + "  " + message;
  content = content + "\n\n" + messageToAppend;
  fs.writeFileSync('HISTORY.md', content);
};
