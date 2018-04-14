import { withClientState } from 'apollo-link-state';

const defaultState = {
    sourceCurrency: 'GBP',
    targetCurrency: 'EUR',
    exchangingAmount: '',
    isSourceAmount: true
};

const stateLink = cache => withClientState({
    cache,
    defaults: defaultState,
    resolvers: {}
});

export default stateLink;
