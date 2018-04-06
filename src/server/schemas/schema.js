import { makeExecutableSchema } from 'graphql-tools';

import currencyRatesTypes from './currency-rates/currency-rates.graphql';
import accountTypes from './accounts/accounts.graphql';

import currencyRatesResolvers from './currency-rates/currency-rates-resolvers';
import accountsResolvers from './accounts/accounts-resolvers';

const typeDefs = `
    type Query {
      currencyRates: CurrencyRates
      accounts: [Account]
    }
    ${currencyRatesTypes}
    ${accountTypes}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers: [currencyRatesResolvers, accountsResolvers] });

export default schema;

