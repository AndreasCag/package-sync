const minimist = require('minimist');
const path = require('path');

const defaultCacheFolder = 'node_modules/.cache/package-sync';
const packageFilename = 'package.json';
const defaultCurrentWorkingDir = process.cwd();

const availableOptions = [
  'update',
  'check',
  'install-on-invalid',
];

const argv = minimist(process.argv.slice(2));

const selectedOptions = availableOptions.filter(option => (
  argv.hasOwnProperty(option)
));

if (selectedOptions.length === 0) {
  throw new Error(
    'You have to specify options. Available options:'
    + '\n'
    + '--update'
    + '\n'
    + '--check'
    + '\n'
    + '--install-on-invalid',
  );
}

if (selectedOptions.length !== 1) {
  throw new Error('You have to specify only one option.');
}

const pathToCache = path.resolve(defaultCurrentWorkingDir, defaultCacheFolder);

module.exports = {
  mode: selectedOptions[0],
  pathToPackageJson: path.resolve(defaultCurrentWorkingDir, packageFilename),
  pathToCache,
  pathToCacheFile: path.resolve(pathToCache, '.packageHash'),
};
