// @flow
import { Base } from './base';

export class Record extends Base {
    static get tableName() {
        return 'record';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['date', 'distance', 'time', 'averageSpeed'],
            properties: {
                id: { type: ['integer'] },
                date: { type: ['bigInteger'] },
                distance: { type: ['integer'] },
                time: { type: ['integer'] },
                averageSpeed: { type: ['float'] },
                userId: { type: ['integer'] }
            }
        };
    }

    static get pickJsonSchemaProperties() {
        return true;
    }
}
