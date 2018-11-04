const isHerokuEnvironment =
    process.env.NODE && process.env.NODE.indexOf('heroku') > -1;
const isInsideDocker = process.env.DOCKER_BUILD;

if (!isHerokuEnvironment && !isInsideDocker) {
    // eslint-disable-next-line global-require
    require('dotenv-safe').config({
        example: './.env.example',
        path: './.env'
    });
}
