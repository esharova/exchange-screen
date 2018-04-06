import express from 'express';
import { graphiqlExpress } from 'apollo-server-express';

import config from 'config';

const route = express.Router({});

route.get('/', graphiqlExpress({ endpointURL: config.server.api.graphql.uri }));

export default route;

