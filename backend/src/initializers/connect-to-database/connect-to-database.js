// @flow
import { Model } from 'objection';
import { connection } from '../../db';

const connectToDatabase = () => {
    Model.knex(connection);
};

export default connectToDatabase;
