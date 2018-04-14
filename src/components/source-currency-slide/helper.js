import { ACCOUNTS } from '../../pages/exchange-screen/exchange-screen';

// FIXME: refetch queries with accounts info
export function updateAccountInfo(cache, {
    sourceAccount, targetAccount, amount, amountInTargetCurrency
}) {
    const { accounts } = cache.readQuery({ query: ACCOUNTS });
    const accountsAfterConvertation = accounts.map((account) => {
        if (account.currency === sourceAccount.currency) {
            return {
                ...account,
                amount: (account.amount - parseFloat(amount)).toFixed(2)
            };
        }
        if (account.currency === targetAccount.currency) {
            return {
                ...account,
                amount: (account.amount + parseFloat(amountInTargetCurrency)).toFixed(2)
            };
        }
        return account;
    });
    cache.writeQuery({
        query: ACCOUNTS,
        data: { accounts: accountsAfterConvertation }
    });
}
