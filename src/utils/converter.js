export function convert({ exchangingAmount, sourceCurrency, targetCurrency }, { rates, base }) {
    let convertedAmount;
    let rate;

    const exchangingAmountNumber = parseFloat(exchangingAmount.replace(',', '.'));

    if (sourceCurrency === base) {
        convertedAmount = rates[targetCurrency] * exchangingAmountNumber;
        rate = rates[targetCurrency];
    }

    if (sourceCurrency === base && targetCurrency === base) {
        convertedAmount = exchangingAmountNumber;
        rate = 1;
    }

    if (rates[sourceCurrency]) {
        const amountInBaseCurrency = (1 / rates[sourceCurrency]) * exchangingAmountNumber;
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
