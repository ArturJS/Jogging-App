const isHerokuEnvironment = process.env.NODE && ~process.env.NODE.indexOf('heroku');

if (!isHerokuEnvironment) {
  console.info('"heroku-build" task skipped (due to non heroku environment)...');
  process.exit(0);
}

console.log('Heroku build started...');

const {spawn} = require('child_process');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');
const extension = process.platform === 'win32' ? '.cmd' : '';
const herokuBuild = spawn(`npx${extension}`, [
  'npm-run-all',
  '-s',
  'build',
  'create-db-prod',
  'db:migrate'
], {
  cwd: projectPath
});

herokuBuild.stdout.on('data', (data) => {
  console.log(`stdout: ${data.toString()}`);
});

herokuBuild.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

herokuBuild.on('close', (code) => {
  if (code !== 0) {
    console.error('Heroku build failed...');
  } else {
    console.log('Heroku build done!');
  }

  process.exit(code);
});
