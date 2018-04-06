import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';

import schema from '../schemas/schema';

const router = express.Router();

router.post('/', bodyParser.json(), graphqlExpress({ schema }));

export default router;
