import { User } from '../../db';

export class AuthDAL {
    constructor() {
        this._userModel = User;
    }

    async getUserByEmail(email) {
        const user = await this._userModel
            .query()
            .where({ email })
            .first();

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
        };
    }

    async hasUserWithEmail(email) {
        const { count: usersCount } = await this._userModel
            .query()
            .where({ email })
            .count()
            .first();

        return usersCount > 0;
    }

    async createUser({ firstName, lastName, email, password }) {
        const user = await this._userModel.query().insert({
            firstName,
            lastName,
            email,
            password
        });

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }
}
