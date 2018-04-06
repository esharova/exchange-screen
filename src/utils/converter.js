export function convert({ exchangingAmount, sourceCurrency, targetCurrency }, { rates, base }) {
    let convertedAmount;
    let rate;

    if (sourceCurrency === base) {
        convertedAmount = rates[targetCurrency] * exchangingAmount;
        rate = rates[targetCurrency];
    }

    if (rates[sourceCurrency]) {
        const amountInBaseCurrency = (1 / rates[sourceCurrency]) * exchangingAmount;
        const rateToBaseCurrency = 1 / rates[sourceCurrency];

        convertedAmount = targetCurrency === base
            ? amountInBaseCurrency
            : amountInBaseCurrency * rates[targetCurrency];

        rate = targetCurrency === base ? rateToBaseCurrency : rateToBaseCurrency * rates[targetCurrency];
    }

    return {
        convertedAmount: convertedAmount.toFixed(2),
        rate: rate.toFixed(2)
    };
}
