import React, { Fragment } from 'react';
import Type from 'prop-types';

import { autobind } from 'core-decorators';

import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';

import cn from 'arui-feather/cn';
import Spin from 'arui-feather/spin';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

import SourceCurrencySlide from '../../components/source-currency-slide/source-currency-slide';
import TargetCurrencySlide from '../../components/target-currency-slide/target-currency-slide';

import './exchange-screen.css';

const RATES = gql`
    query currencyRates($base: String!) {
        currencyRates(base: $base) {
            base
            rates {
                EUR
                GBP
            }
        }
    }
`;

const ACCOUNTS = gql`
    query accounts {
        accounts {
            number
            currency
            amount
        }
    }
`;

const GET_SOURCE_TARGET_CURRENCY = gql`
  {
    sourceCurrency @client
    targetCurrency @client
    exchangingAmount @client
  }
`;

@withApollo
@cn('exchange-screen')
export default class CharacteristicsPage extends React.Component {
    static propTypes = {
        client: Type.shape({
            writeData: Type.func
        })
    };

    state = {
        sourcePosition: 0,
        baseCurrency: 'USD'
    }

    customCarouselProps = {
        showStatus: false,
        showThumbs: false,
        showArrows: false,
        emulateTouch: true,
        transitionTime: 200
    }

    render(cn) {
        return (
            <Query query={ ACCOUNTS } >
                { ({ loading: loadingAccounts, data: { accounts } }) => (
                    <Query
                        query={ RATES }
                        pollInterval={ 10000 }
                        variables={ { base: this.state.baseCurrency } }
                    >
                        { ({ loading: loadingRates, data: { currencyRates } }) => {
                            if (loadingAccounts || loadingRates) {
                                return <Spin visible={ true } />;
                            }
                            return (
                                <div className={ cn() }>
                                    { this.renderSourceAndTargetCurrency(cn, accounts, currencyRates) }
                                </div>
                            );
                        } }
                    </Query>
                ) }
            </Query>
        );
    }

    renderSourceAndTargetCurrency(cn, accounts, currencyRates) {
        return (
            <Query query={ GET_SOURCE_TARGET_CURRENCY }>
                { ({ data: { sourceCurrency, exchangingAmount } }) => (
                    <Fragment>
                        <Carousel
                            className={ cn('source-currency') }
                            selectedItem={ this.state.sourcePosition }
                            onChange={ (sourcePosition) => {
                                this.handleChangeSourceCurrency(sourcePosition, accounts);
                            } }
                            { ...this.customCarouselProps }
                        >
                            { accounts.map(account => (
                                <SourceCurrencySlide
                                    key={ account.number }
                                    account={ account }
                                    exchangingAmount={ exchangingAmount }
                                    sourceCurrency={ sourceCurrency }
                                    onChangeExchangingAmount={ this.handleChangeExchangingAmount }
                                />
                            )) }
                        </Carousel>
                        <Carousel
                            className={ cn('target-currency') }
                            onChange={ (targetPosition) => {
                                this.handleChangeTargetCurrency(targetPosition, sourceCurrency, accounts);
                            } }
                            { ...this.customCarouselProps }
                        >
                            { this.getFilteredAccounts(accounts, sourceCurrency).map(account => (
                                <TargetCurrencySlide
                                    key={ account.number }
                                    className={ cn('target-currency-slide') }
                                    account={ account }
                                    exchangingAmount={ exchangingAmount }
                                    sourceCurrency={ sourceCurrency }
                                    currencyRates={ currencyRates }
                                />
                            )) }
                        </Carousel>
                    </Fragment>
                ) }
            </Query>
        );
    }

    @autobind
    handleChangeSourceCurrency(sourcePosition, accounts) {
        this.setState({ sourcePosition });
        this.props.client.writeData({
            data: { sourceCurrency: accounts[sourcePosition].currency }
        });
    }

    @autobind
    handleChangeTargetCurrency(targetPosition, sourceCurrency, accounts) {
        this.props.client.writeData({
            data: { targetCurrency: this.getFilteredAccounts(accounts, sourceCurrency)[targetPosition].currency }
        });
    }

    @autobind
    handleChangeExchangingAmount(value) {
        this.props.client.writeData({
            data: { exchangingAmount: value.replace(/ /g, '') }
        });
    }

    getFilteredAccounts(accounts, sourceCurrency) {
        return accounts.filter(account => account.currency !== sourceCurrency);
    }
}

