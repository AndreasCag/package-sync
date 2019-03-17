const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const options = require('./options');

const getHash = data => (
  crypto.createHash('md5').update(data).digest('hex')
);

const tryMakeDirDeep = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const packageData = fs.readFileSync(options.pathToPackageJson, 'utf-8');
const packageHash = getHash(packageData);

if (options.mode === 'update') {
  tryMakeDirDeep(options.pathToCache);

  fs.writeFileSync(options.pathToCacheFile, packageHash);
} else if (options.mode === 'check') {
  const previousPackageHash = fs.readFileSync(options.pathToCacheFile, 'utf-8');

  if (previousPackageHash !== packageHash) {
    throw new Error('Package hashes don\'t match! Update your packages.');
  }
} else {
  const previousPackageHash = fs.readFileSync(options.pathToCacheFile, 'utf-8');

  if (previousPackageHash === packageHash) {
    exec('npm i');
  }
}
