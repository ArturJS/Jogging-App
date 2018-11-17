import config from '../../config';
import createHttpServer from './create-http-server';
import createHttp2Server from './create-http2-server';

const { isProduction } = config;

const initializeHttpServer = callback =>
    isProduction ? createHttp2Server(callback) : createHttpServer(callback);

export default initializeHttpServer;
