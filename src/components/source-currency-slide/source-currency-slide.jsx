import React, { Fragment } from 'react';
import Type from 'prop-types';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { autobind } from 'core-decorators';

import omit from 'lodash/omit';

import cn from 'arui-feather/cn';
import MoneyInput from 'arui-feather/money-input';
import Label from 'arui-feather/label';
import Button from 'arui-feather/button';

import CurrencyIcon from '../currency-icon/currency-icon';

import { convert } from '../../utils/converter';
import { updateAccountInfo } from './helper';
import { createExchangeAmountValidator } from './validator';

import './source-currency-slide.css';

const EXCHANGE_CURRENCY = gql`
    mutation exchangeCurrency($exchangeInfo: ExchangeInfo!) {
        exchangeCurrency(exchangeInfo: $exchangeInfo)
    }
`;

@cn('source-currency-slide')
export default class SourceCurrencySlide extends React.Component {
    static propTypes= {
        account: Type.shape(),
        currencyRates: Type.shape(),
        sourceCurrency: Type.string,
        targetCurrency: Type.string,
        onChangeExchangingAmount: Type.func,
        exchangingAmount: Type.string,
        isSourceAmount: Type.bool,
        targetAccount: Type.shape()
    };

    state = {
        exchangingAmountError: ''
    }


    constructor(props, context) {
        super(props, context);
        this.validator = createExchangeAmountValidator();
    }

    componentDidMount() {
        const { account, sourceCurrency } = this.props;
        account.currency === sourceCurrency && this.moneyInput.focus();
    }

    render(cn) {
        return (
            <div className={ cn() }>
                { this.renderPanelButtons(cn) }
                { this.renderCurrency(cn) }
            </div>
        );
    }

    renderPanelButtons(cn) {
        const { sourceCurrency, targetCurrency, currencyRates } = this.props;
        const { rate } = convert({ exchangingAmount: '0', sourceCurrency, targetCurrency }, currencyRates);
        return (
            <div className={ cn('panel-buttons') }>
                <Button
                    className={ cn('cancel') }
                    text='Cancel'
                />
                <div className={ cn('rates') }>
                    <CurrencyIcon currency={ sourceCurrency } />
                    <Label size='s'>
                        { '1 = ' }
                    </Label>
                    <CurrencyIcon currency={ targetCurrency } />
                    <Label size='s'>
                        { rate }
                    </Label>
                </div>
                <Mutation mutation={ EXCHANGE_CURRENCY } update={ this.handleUpdateAccountInfo }>
                    { exchangeCurrency => (
                        <Button
                            className={ cn('exchange') }
                            text='Exchange'
                            onClick={ () => {
                                this.handleExchange(exchangeCurrency);
                            } }
                        />
                    ) }
                </Mutation>
            </div>
        );
    }

    renderCurrency(cn) {
        const { account } = this.props;
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
                { this.renderExchangingAmount(cn) }
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
        const { exchangingAmount } = this.props;
        const { convertedAmount } = this.getConvertationInfo();
        return (
            <div className={ cn('exchanging-amount') } >
                { exchangingAmount &&
                    <Label
                        className={ cn('operation') }
                        size='xl'
                    >
                        -
                    </Label>
                }
                <MoneyInput
                    className={ cn('money-input') }
                    size='xl'
                    ref={ (moneyInput) => { this.moneyInput = moneyInput; } }
                    type='money'
                    error={ this.state.exchangingAmountError }
                    pattern='\d*'
                    value={ convertedAmount }
                    onChange={ this.props.onChangeExchangingAmount }
                />
            </div>
        );
    }

    @autobind
    handleExchange(exchangeAmountMutation) {
        const { convertedAmount } = this.getConvertationInfo();
        const exchangingAmountError = this.validator(convertedAmount, this.props.account.amount);
        this.setState({ exchangingAmountError });
        if (!exchangingAmountError) {
            exchangeAmountMutation({
                variables: {
                    exchangeInfo: omit(this.getExchangeInfo(), 'amountInTargetCurrency')
                }
            });
        }
    }

    @autobind
    handleUpdateAccountInfo(cache) {
        updateAccountInfo(cache, this.getExchangeInfo());
        this.props.onChangeExchangingAmount('0');
    }

    getExchangeInfo() {
        const { convertedAmount } = this.getConvertationInfo();
        const {
            account, targetAccount, targetCurrency, currencyRates
        } = this.props;
        const amountInTargetCurrency = convert({
            exchangingAmount: convertedAmount,
            sourceCurrency: account.currency,
            targetCurrency
        }, currencyRates).convertedAmount;
        return {
            amount: convertedAmount.replace(',', '.'),
            amountInTargetCurrency: amountInTargetCurrency.replace(',', '.'),
            sourceAccount: {
                number: account.number,
                currency: account.currency
            },
            targetAccount: {
                number: targetAccount.number,
                currency: targetAccount.currency
            }
        };
    }

    getConvertationInfo() {
        const {
            exchangingAmount, isSourceAmount, targetCurrency, account, currencyRates
        } = this.props;
        return isSourceAmount
            ? { convertedAmount: exchangingAmount }
            : convert({
                exchangingAmount,
                sourceCurrency: targetCurrency,
                targetCurrency: account.currency
            }, currencyRates);
    }
}
