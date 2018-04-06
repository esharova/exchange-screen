/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import 'babel-polyfill';

import config from 'config';
import express from 'express';

import indexRoute from './routes/index';
import graphqlRoute from './routes/graphql';
import graphiqlRoute from './routes/graphiql';

const app = express();
const SERVER_PORT = config.get('server.port');

if (config.useMocks) {
    require('./mocks/mock'); // eslint-disable-line global-require
}

app.use(express.static('.build/assets'));

app.use('/graphql', graphqlRoute);
app.use('/graphiql', graphiqlRoute);
app.use('/', indexRoute);

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port : ${SERVER_PORT}...`);
});

