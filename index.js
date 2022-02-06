'use strict';
exports.handler = (event, context, callback) => {

    // Env variables don't work with Lambda@Edge >:(
    const authUser = 'guest';
    const authPass = 'password';
    const whitelist = [/^\/$/, /^\/index.html$/, /favicon.ico$/, /^\/robots.txt$/, /^\/public\//];
    const redirectRegex = /^\/private\/[a-z]+$/;
    const redirectSrc = ['/private', '/private/'];
    const redirectDest = '/private/index.html';

    const request = event.Records[0].cf.request;
    const headers = request.headers;

    var uri = request.uri;
    
    // Redirect /private/{page}
    if (redirectRegex.test(uri) || redirectSrc.includes(uri)) {
        const newUri = redirectDest;
        console.info(`Soft redirecting ${uri} to ${newUri}`);
        request.uri = newUri;
        uri = newUri;
    }

    if (whitelist.some(regex => regex.test(uri))) {
        console.info(`Bypassed auth for whitelisted URI: ${uri}`);
        callback(null, request);
        return;
    }

    const authString = `Basic ${new Buffer(`${authUser}:${authPass}`).toString('base64')}`;
    if (typeof headers.authorization == 'undefined' || headers.authorization[0].value != authString) {
        const response = {
            status: '401',
            statusDescription: 'Unauthorized',
            body: 'Unauthorized',
            headers: {
                'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
            },
        };
        console.info(`Failed auth for URI: ${uri} with auth headers ${JSON.stringify(headers.authorization)}`);
        callback(null, response);
        return;
    }

    console.info(`Auth passed for URI: ${uri}`);
    callback(null, request);
    return;
};
