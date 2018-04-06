/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';

import { Root } from './root';

if (typeof window !== 'undefined') {
    window.__main = () => {
        ReactDOM.hydrate(<Root />, document.getElementById('react-app'));
    };
}
