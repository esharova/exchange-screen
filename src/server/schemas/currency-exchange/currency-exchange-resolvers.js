import config from 'config';
import { exchangeCurrency } from '../../services/exchange-currency';

const apiConfig = config.server.api.exchangeCurrency;

const resolvers = {
    Mutation: {
        exchangeCurrency(obj, { exchangeInfo }, context) {
            return exchangeCurrency(context, { ...apiConfig }, { body: exchangeInfo });
        }
    }
};

export default resolvers;
