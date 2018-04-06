import req from '../lib/request';

export function getAccounts(getAccountsRequest, config, options) {
    return req(getAccountsRequest, { ...config }, options)
        .then(response => response.body);
}
