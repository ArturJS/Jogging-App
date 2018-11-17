import config from '../../config';
import createHttpServer from './create-http-server';
import createHttp2Server from './create-http2-server';

const { enforceHttps } = config;

const initializeHttpServer = callback =>
    enforceHttps ? createHttp2Server(callback) : createHttpServer(callback);

export default initializeHttpServer;
