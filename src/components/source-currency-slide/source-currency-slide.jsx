import React, { Fragment } from 'react';
import Type from 'prop-types';

import cn from 'arui-feather/cn';
import MoneyInput from 'arui-feather/money-input';
import Label from 'arui-feather/label';
import Button from 'arui-feather/button';

import CurrencyIcon from '../currency-icon/currency-icon';

import { convert } from '../../utils/converter';

import './source-currency-slide.css';

@cn('source-currency-slide')
export default class SourceCurrencySlide extends React.Component {
    static propTypes= {
        account: Type.shape(),
        currencyRates: Type.shape(),
        sourceCurrency: Type.string,
        targetCurrency: Type.string,
        onChangeExchangingAmount: Type.func,
        exchangingAmount: Type.string
    };

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
        const { rate } = convert({ exchangingAmount: 0, sourceCurrency, targetCurrency }, currencyRates);
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
                <Button
                    className={ cn('exchange') }
                    text='Exchange'
                />
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
                    pattern='\d*'
                    value={ exchangingAmount }
                    onChange={ this.props.onChangeExchangingAmount }
                />
            </div>
        );
    }
}
