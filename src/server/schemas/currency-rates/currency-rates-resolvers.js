import config from 'config';
import { getCurrencyRates } from '../../services/currency-rates';

const apiConfig = config.server.api.currencyRates;

const resolvers = {
    Query: {
        currencyRates(root, args, context) {
            return getCurrencyRates(context, apiConfig);
        }
    }
};

export default resolvers;
