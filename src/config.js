const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const APP_NAME = 'Jogging App';

const config = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: APP_NAME,
    description: 'All the modern best practices in one example.',
    head: {
      titleTemplate: `${APP_NAME}: %s`,
      meta: [
        {name: 'description', content: 'All the modern best practices in one example.'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: APP_NAME},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: APP_NAME},
        {property: 'og:description', content: 'All the modern best practices in one example.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  }

}, environment);

const apiTargetUrl = `http://${config.apiHost}:${config.apiPort}`;
const uiTargetUrl = `http://${config.host}:${config.port}`;

module.exports = Object.assign(config, {apiTargetUrl, uiTargetUrl});
