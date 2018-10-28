const isHerokuEnvironment =
    process.env.NODE && process.env.NODE.indexOf('heroku') > -1;

if (!isHerokuEnvironment) {
    // eslint-disable-next-line global-require
    require('dotenv-safe').config({
        example: './.env.example',
        path: './.env'
    });
}
