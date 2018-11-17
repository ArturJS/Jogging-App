import http from 'http';

const createHttpServer = callback => http.createServer(callback);

export default createHttpServer;
