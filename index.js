/*!
 * project-name <https://github.com/jonschlinkert/project-name>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var cached;

/**
 * Resolves in this order:
 *  1. package.json `name`
 *  2. git repository `name`
 *  3. `path.basename` of the current working directory
 */

module.exports = function (fp) {
  return pkgname(fp) || gitname(fp) || basename(fp);
};

/**
 * Get the `name` property from package.json
 */

function pkgname(fp) {
  var pkg = utils.pkg(fp);
  if (pkg) return pkg.name;
  return;
}

/**
 * Get the git repository `name`, silently fail
 */

function gitname(fp) {
  try {
    return utils.git.sync(dirname(fp));
  } catch (err) {}
  return null;
}

/**
 * Get the `path.basename` of the current working directory.
 */

function basename(fp) {
  return path.basename(dirname(fp));
}

/**
 * Utility for getting the dirname of the given filepath.
 * The first result is cached to speed up subsequent
 * calls.
 */

function dirname(fp) {
  if (cached) return cached;
  var dir = utils.cwd(fp);
  if (fs.statSync(dir).isFile()) {
    dir = path.dirname(dir);
  }
  return (cached = dir);
}
