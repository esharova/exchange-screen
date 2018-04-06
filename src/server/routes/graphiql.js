import express from 'express';
import { graphiqlExpress } from 'apollo-server-express';

const route = express.Router();

route.get('/', graphiqlExpress({ endpointURL: '/graphql' }));

export default route;

