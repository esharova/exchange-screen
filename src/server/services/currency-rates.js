import req from '../lib/request';

export function getCurrencyRates(getCurrencyRatesRequest, config, options) {
    return req(getCurrencyRatesRequest, { ...config }, options)
        .then(response => response.body);
}
