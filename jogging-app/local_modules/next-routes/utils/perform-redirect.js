export const performRedirect = ({ req, res, redirectTo }) => {
    const { baseUrl } = req.appMeta;

    res.writeHead(301, {
        Location: baseUrl + redirectTo
    });
    res.end();
};
