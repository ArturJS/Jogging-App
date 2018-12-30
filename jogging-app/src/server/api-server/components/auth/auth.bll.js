import bcrypt from 'bcrypt-nodejs';
import authDAL from './auth.dal';
import { ErrorUserAlreadyExists, ErrorWrongCredentials } from './auth.errors';

const mapUser = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

const validatePassword = async ({ hashedPassword, password }) =>
    new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (isMatch) {
                resolve();
            } else {
                reject(new ErrorWrongCredentials());
            }
        });
    });

const authBLL = {
    async getUser({ email, password }) {
        const user = await authDAL.getUserByEmail(email);

        if (!user) {
            throw new ErrorWrongCredentials();
        }

        await validatePassword({
            hashedPassword: user.password,
            password
        });

        return mapUser(user);
    },

    async createUser({ firstName, lastName, email, password }) {
        const isAlreadyExists = await authDAL.hasUserWithEmail(email);

        if (isAlreadyExists) {
            throw new ErrorUserAlreadyExists();
        }

        const user = await authDAL.createUser({
            firstName,
            lastName,
            email,
            password
        });

        return mapUser(user);
    }
};

export default authBLL;
