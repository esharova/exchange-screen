import config from 'config';
import cache from '../../cache/cache';

import { getCurrencyRates } from '../../services/currency-rates';

const apiConfig = config.server.api.currencyRates;

const resolvers = {
    Query: {
        currencyRates(root, { base }, context) {
            const cachedCurrencyRates = cache.get(base);
            if (!cachedCurrencyRates) {
                return getCurrencyRates(context, apiConfig)
                    .then((currencyRates) => {
                        cache.set(base, currencyRates);
                        return currencyRates;
                    });
            }
            return cachedCurrencyRates;
        }
    }
};

export default resolvers;
