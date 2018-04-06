import config from 'config';

export default function buildRequestOptions(userRequest, extendOptions = {}) {
    return Object.assign({
        headers: {
            contentType: 'application/json'
        },
        timeout: config.server.requestTimeout,
        json: true
    }, extendOptions);
}
