import React from 'react';

import CurrencyEur from 'arui-feather/icon/currency/currency-eur';
import CurrencyUsd from 'arui-feather/icon/currency/currency-usd';
import CurrencyGbp from 'arui-feather/icon/currency/currency-gbp';

import { Currencies } from './constants';

export function getCurrencyIcon(currency) {
    const iconProps = {
        size: 's'
    };
    switch (currency) {
        case Currencies.EUR:
            return <CurrencyEur { ...iconProps } />;
        case Currencies.USD:
            return <CurrencyUsd { ...iconProps } />;
        case Currencies.GBP:
            return <CurrencyGbp { ...iconProps } />;
    }

    return <CurrencyUsd { ...iconProps } />;
}