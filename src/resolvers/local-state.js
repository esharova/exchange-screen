import { withClientState } from 'apollo-link-state';

const defaultState = {
    sourceCurrency: 'GBP',
    targetCurrency: 'EUR',
    exchangingAmount: ''
}

const stateLink = cache => withClientState({
    cache,
    defaults: defaultState,
    resolvers: {}
});

export default stateLink;
