import path from 'path';
import fs from 'fs';
import http2 from 'http2';

const getPathToCertificate = filename =>
    path.resolve(__dirname, `../../certs/${filename}`);

const createHttp2Server = callback =>
    http2.createSecureServer(
        {
            key: fs.readFileSync(getPathToCertificate('cert.key')),
            cert: fs.readFileSync(getPathToCertificate('cert.crt'))
        },
        callback
    );

export default createHttp2Server;
