import React, { Fragment } from 'react';
import Type from 'prop-types';

import cn from 'arui-feather/cn';
import Label from 'arui-feather/label';

import CurrencyIcon from '../currency-icon/currency-icon';
import { convert } from '../../utils/converter';

import './target-currency-slide.css';

@cn('target-currency-slide')
export default class TargetCurrencySlide extends React.Component {
    static propTypes= {
        account: Type.shape(),
        currencyRates: Type.shape(),
        exchangingAmount: Type.string,
        sourceCurrency: Type.string
    }

    render(cn) {
        return (
            <div className={ cn() }>
                <div className={ cn('arrow') } />
                { this.renderCurrency(cn) }
            </div>
        );
    }

    renderCurrency(cn) {
        const {
            account, exchangingAmount
        } = this.props;
        return (
            <div className={ cn('currency') }>
                <div className={ cn('currency-amount') }>
                    <Label
                        className={ cn('currency-symbol') }
                        size='xl'
                    >
                        { account.currency }
                    </Label>
                    <br />
                    { this.renderAccountAmount(cn) }
                </div>
                { exchangingAmount && this.renderExchangingAmount(cn) }
            </div>
        );
    }

    renderAccountAmount(cn) {
        const { currency, amount } = this.props.account;
        return (
            <Fragment>
                <Label size='s' className={ cn('account-amount') }>
                    { 'You have ' }
                </Label>
                <CurrencyIcon currency={ currency } />
                <Label size='s' className={ cn('account-amount') }>
                    { amount }
                </Label>
            </Fragment>
        );
    }

    renderExchangingAmount(cn) {
        const {
            account, exchangingAmount, currencyRates, sourceCurrency
        } = this.props;
        return (
            <div className={ cn('exchanging-amount') } >
                { this.renderOperationSign(cn) }
                <Label
                    className={ cn('converted-amount') }
                    size='xl'
                >
                    { convert({
                        exchangingAmount,
                        sourceCurrency,
                        targetCurrency: account.currency
                    }, currencyRates).convertedAmount }
                </Label>
                <br />
                { this.renderRates(cn) }
            </div>
        );
    }

    renderOperationSign(cn) {
        return (
            <Label
                className={ cn('operation') }
                size='xl'
            >
                +
            </Label>
        );
    }

    renderRates(cn) {
        const {
            account: { currency }, exchangingAmount, currencyRates, sourceCurrency
        } = this.props;
        const { rate } = convert({
            exchangingAmount,
            sourceCurrency,
            targetCurrency: currency
        }, currencyRates);
        return (
            <Fragment>
                <CurrencyIcon currency={ currency } />
                <Label size='s' className={ cn('rates') }>
                    { '1 = ' }
                </Label>
                <CurrencyIcon currency={ sourceCurrency } />
                <Label size='s' className={ cn('rates') }>
                    { (1 / rate).toFixed(2) }
                </Label>
            </Fragment>
        );
    }
}

