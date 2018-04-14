import { makeExecutableSchema } from 'graphql-tools';

import currencyRatesTypes from './currency-rates/currency-rates.graphql';
import accountTypes from './accounts/accounts.graphql';
import currencyExchangeTypes from './currency-exchange/currency-exchange.graphql';

import currencyRatesResolvers from './currency-rates/currency-rates-resolvers';
import accountsResolvers from './accounts/accounts-resolvers';
import currencyExchangeResolvers from './currency-exchange/currency-exchange-resolvers';

const typeDefs = `
    type Query {
      currencyRates(base: String): CurrencyRates
      accounts: [Account]
    }
    type Mutation {
        exchangeCurrency(exchangeInfo: ExchangeInfo!): Boolean
    }
    ${currencyRatesTypes}
    ${accountTypes}
    ${currencyExchangeTypes}
`;

const resolvers = [currencyRatesResolvers, accountsResolvers, currencyExchangeResolvers];
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;

