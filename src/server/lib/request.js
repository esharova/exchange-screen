import requestAgent from 'request';
import config from 'config';
import isString from 'lodash/isString';
import log from './logger';
import buildRequestOptions from './build-request-options';

export function request(userRequest, apiConfig, params = {}) {
    if (isString(apiConfig)) {
        apiConfig = config.get(`server.api.${apiConfig}`);
    }

    params = Object.assign({}, apiConfig, params);

    const options = buildRequestOptions(userRequest, params);

    return new Promise((resolve, reject) => {
        requestAgent(options, (error, response) => {
            let requestParams = `${options.method} ${options.uri}`;
            log.info(`server-request ${requestParams}: `, options);

            if (error) {
                log.error(`server-request ${requestParams} error: `, error.body);
                reject(error);
            } else if (~~(response.statusCode / 100) !== 2) {
                log.error(`server-response ${requestParams} with status ${response.statusCode}: `, response.body);
                reject({
                    ...response.body,
                    statusCode: response.statusCode
                });
            } else {
                log.info(`server-response ${requestParams}: `, response.body);
                resolve(response);
            }
        });
    });
}

export default request;
