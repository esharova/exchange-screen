import config from 'config';
import { getAccounts } from '../../services/accounts';

const apiConfig = config.server.api.accounts;

const resolvers = {
    Query: {
        accounts(root, args, context) {
            return getAccounts(context, apiConfig);
        }
    }
};

export default resolvers;
