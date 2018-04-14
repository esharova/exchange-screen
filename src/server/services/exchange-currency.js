import req from '../lib/request';

export function exchangeCurrency(exchangeCurrencyRequest, config, options) {
    return req(exchangeCurrencyRequest, { ...config }, options)
        .then(response => response.body);
}
