const { exec } = require('child_process');

const isHerokuEnvironment = process.env.NODE && ~process.env.NODE.indexOf('heroku');

if (!isHerokuEnvironment) {
  console.info('"heroku-build" task skipped (due to non heroku environment)...');
  process.exit(0);
}

const buildSSRBundle = 'better-npm-run build';
const createDatabaseIfAbsent = 'better-npm-run create-db-prod';
const applyDatabaseMigrations = 'npx sequelize db:migrate';
const tasks = [
  buildSSRBundle,
  createDatabaseIfAbsent,
  applyDatabaseMigrations
].join(' && ');

console.log('Heroku build started...');

exec(tasks, (error, stdout, stderr) => {
  if (error) {
    console.error('Heroku build failed with error:');
    console.error(error);
    process.exit(1);

    return;
  }

  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  console.log('Heroku build done!');
});
