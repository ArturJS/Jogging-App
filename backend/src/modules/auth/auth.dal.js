import db from '../../models';

export class AuthDAL {
    async getUserByEmail(email) {
        const user = await db.User.findOne({ where: { email } });

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
        };
    }

    async hasUserWithEmail(email) {
        const usersCount = await db.User.count({ where: { email } });

        return usersCount > 0;
    }

    async createUser({ firstName, lastName, email, password }) {
        const user = await db.User.create({
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
