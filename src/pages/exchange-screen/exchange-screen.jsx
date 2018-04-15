import React, { Fragment } from 'react';
import Type from 'prop-types';

import { autobind } from 'core-decorators';

import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';

import cn from 'arui-feather/cn';
import Spin from 'arui-feather/spin';
import Label from 'arui-feather/label';
import Notification from 'arui-feather/notification';
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

export const ACCOUNTS = gql`
    query accounts {
        accounts {
            number
            currency
            amount
        }
    }
`;

export const GET_SOURCE_TARGET_CURRENCY = gql`
  {
    sourceCurrency @client
    targetCurrency @client
    exchangingAmount @client
    isSourceAmount @client
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
        targetPosition: 0,
        baseCurrency: 'USD',
        notification: {}
    }

    customCarouselProps = {
        showStatus: false,
        showThumbs: false,
        showArrows: false,
        emulateTouch: true,
        transitionTime: 200
    }

    render(cn) {
        const { notification } = this.state;
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
                                    <Notification
                                        visible={ notification.visible }
                                        stickTo='right'
                                        status='ok'
                                        onCloserClick={ this.handleCloseNotification }
                                    >
                                        <Label>{ notification.text }</Label>
                                    </Notification>
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
                { ({
                    data: {
                        sourceCurrency, exchangingAmount, targetCurrency, isSourceAmount
                    }
                }) => {
                    const targetAccount = accounts.find(account => account.currency === targetCurrency);
                    const currencySlideProps = {
                        sourceCurrency,
                        exchangingAmount,
                        targetCurrency,
                        isSourceAmount,
                        currencyRates,
                        targetAccount
                    };
                    return (
                        <Fragment>
                            <Carousel
                                className={ cn('source-currency') }
                                selectedItem={ this.state.sourcePosition }
                                onChange={ (sourcePosition) => {
                                    this.handleChangeSourceCurrency(sourcePosition, targetCurrency, accounts);
                                } }
                                { ...this.customCarouselProps }
                            >
                                { accounts.map(account => (
                                    <SourceCurrencySlide
                                        key={ account.number }
                                        account={ account }
                                        { ...currencySlideProps }
                                        onChangeExchangingAmount={ (value) => {
                                            this.handleChangeExchangingAmount(value, true);
                                        } }
                                        onExchangeAmount={ this.handleExchangeAmount }
                                    />
                                )) }
                            </Carousel>
                            <div className={ cn('direction') }>
                                <div className={ cn('arrow') } />
                            </div>
                            <Carousel
                                className={ cn('target-currency') }
                                selectedItem={ this.state.targetPosition }
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
                                        { ...currencySlideProps }
                                        onChangeExchangingAmount={ (value) => {
                                            this.handleChangeExchangingAmount(value, false);
                                        } }
                                    />
                                )) }
                            </Carousel>
                        </Fragment>
                    );
                } }
            </Query>
        );
    }

    @autobind
    handleChangeSourceCurrency(sourcePosition, targetCurrency, accounts) {
        const sourceCurrency = accounts[sourcePosition].currency;
        this.setState({ sourcePosition });
        sourceCurrency === targetCurrency && this.handleChangeTargetCurrency(0, sourceCurrency, accounts);
        this.props.client.writeData({
            data: { sourceCurrency }
        });
    }

    @autobind
    handleChangeTargetCurrency(targetPosition, sourceCurrency, accounts) {
        this.setState({ targetPosition });
        const targetAccount = this.getFilteredAccounts(accounts, sourceCurrency)[targetPosition];
        this.props.client.writeData({
            data: {
                targetCurrency: targetAccount.currency
            }
        });
    }

    @autobind
    handleChangeExchangingAmount(value, isSourceAmount) {
        this.props.client.writeData({
            data: {
                exchangingAmount: value.replace(/ /g, ''),
                isSourceAmount
            }
        });
    }

    @autobind
    handleExchangeAmount() {
        this.setState({
            notification: {
                visible: true,
                text: 'Перевод успешно выполнен'
            }
        });
    }

    @autobind
    handleCloseNotification() {
        this.setState({
            notification: {
                ...this.state.notification,
                visible: false
            }
        });
    }

    getFilteredAccounts(accounts, sourceCurrency) {
        return accounts.filter(account => account.currency !== sourceCurrency);
    }
}

