// @flow
import knex from 'knex';
import config from '../../config';

export const connection = knex(config.db);
