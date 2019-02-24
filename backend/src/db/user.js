// @flow
import { promisify } from 'util';
import bcrypt from 'bcrypt-nodejs';
import { Base } from './base';

const SALT_WORK_FACTOR = 10;
const generateSalt = promisify(bcrypt.genSalt);
const hashString = promisify(bcrypt.hash);
const hashPassword = async password => {
    const salt = await generateSalt(SALT_WORK_FACTOR);
    const hashedPassword = await hashString(password, salt, null);

    return hashedPassword;
};

export class User extends Base {
    static get tableName() {
        return 'user';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['firstName', 'lastName', 'email', 'password'],
            properties: {
                id: { type: ['integer'] },
                firstName: { type: ['string'] },
                lastName: { type: ['string'] },
                email: { type: ['string'] },
                password: { type: ['string'] }
            }
        };
    }

    static get pickJsonSchemaProperties() {
        return true;
    }

    static get relationMappings() {
        return {
            address: {
                relation: Base.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'user.id', to: 'record.userId' }
            }
        };
    }

    async $beforeInsert() {
        this.password = await hashPassword(this.password);
    }
}
