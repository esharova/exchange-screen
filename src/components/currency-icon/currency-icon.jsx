import React from 'react';
import Type from 'prop-types';

import CurrencyEur from 'arui-feather/icon/currency/currency-eur';
import CurrencyUsd from 'arui-feather/icon/currency/currency-usd';
import CurrencyGbp from 'arui-feather/icon/currency/currency-gbp';

import { Currencies } from '../../utils/constants';


export default class CurrencyIcon extends React.Component {
    static propTypes = {
        currency: Type.string
    }

    render() {
        const iconProps = {
            size: 's'
        };
        switch (this.props.currency) {
            case Currencies.EUR:
                return <CurrencyEur { ...iconProps } />;
            case Currencies.USD:
                return <CurrencyUsd { ...iconProps } />;
            case Currencies.GBP:
                return <CurrencyGbp { ...iconProps } />;
        }

        return <CurrencyUsd { ...iconProps } />;
    }
}