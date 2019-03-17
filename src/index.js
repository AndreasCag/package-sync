const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');
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
} else if (options.mode === 'install-on-invalid') {
  const previousPackageHash = fs.readFileSync(options.pathToCacheFile, 'utf-8');

  if (previousPackageHash !== packageHash) {
    console.log('Install new packages...');
    const data = execSync('npm i');
    console.log(data.toString('utf-8'));

    fs.writeFileSync(options.pathToCacheFile, packageHash);
  }
} else {
  throw new Error(`Unrecognized mode: ${options.mode}`);
}
