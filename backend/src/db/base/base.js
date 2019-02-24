// @flow
import { Model, raw } from 'objection';

export class Base extends Model {
    raw(query: string) {
        return raw(query);
    }
}
