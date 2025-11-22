import { readFile } from 'node:fs/promises';

const newVersion = process.env.$npm_package_version;
console.log(`Bumping version to ${newVersion}`);

const pkgJson = await readFile('package.json', 'utf-8');
const replaced = pkgJson.replace(/"(@nightshadeui\/.*?)": ".*?"/g, `"$1": "${newVersion}"`);

console.log(replaced);
