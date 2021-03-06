import React from 'react';
import Type from 'prop-types';

import { Switch, Route, withRouter } from 'react-router-dom';

import cn from 'arui-feather/cn';
import ThemeProvider from 'arui-feather/theme-provider';

import ExchangeScreenPage from '../../pages/exchange-screen/exchange-screen';

import './app.css';

@withRouter
@cn('app')
export class App extends React.Component {
    static propTypes = {
        error: Type.shape()
    };

    render(cn) {
        return !this.props.error ? this.renderPage(cn) : this.renderErrorPage(cn);
    }

    renderPage(cn) {
        return (
            <ThemeProvider theme='alfa-on-color'>
                <div className={ cn() }>
                    { this.renderRoutes() }
                </div>
            </ThemeProvider>
        );
    }

    renderErrorPage() {
        return null;
    }

    renderRoutes() {
        return (
            <Switch>
                <Route exact={ true } path='/' component={ ExchangeScreenPage } />
                <Route path='*' component={ ExchangeScreenPage } />
            </Switch>
        );
    }
}

export default App;
