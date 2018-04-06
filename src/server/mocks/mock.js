import nock from 'nock';
import config from 'config';

const normalDelay = 1;

nock(config.server.api.currencyRates.uri)
    .persist()
    .get('')
    .delay(normalDelay)
    .reply(200, require('./currency-rates.json'));

nock(config.server.api.accounts.uri)
    .persist()
    .get('')
    .delay(normalDelay)
    .reply(200, require('./accounts.json'));

