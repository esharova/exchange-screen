import { createValidator } from '../../utils/validator';

const required = exchangingAmount => (!exchangingAmount ? 'Введите сумму' : '');

const isZeroEqual = (exchangingAmount) => {
    const hasAmount = !required(exchangingAmount);
    return hasAmount && parseFloat(exchangingAmount) > 0
        ? ''
        : 'Сумма должна быть больше 0';
};

const isGreaterThanAccountBalance = (exchangingAmount, accountBalance) => {
    const hasAmount = !required(exchangingAmount);
    return hasAmount && accountBalance >= parseFloat(exchangingAmount)
        ? ''
        : 'На\u00A0вашем счёте недостаточно средств';
};

export function createExchangeAmountValidator() {
    return createValidator([
        required,
        isZeroEqual,
        isGreaterThanAccountBalance
    ]);
}
