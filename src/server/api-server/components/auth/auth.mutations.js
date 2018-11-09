import { UserError } from 'graphql-errors';
import db from '../../models';

const emailUniquenessValidator = async signUpPayload => {
    const { email } = signUpPayload;
    const userWithSameEmail = await db.User.find({ where: { email } });

    if (userWithSameEmail) {
        throw new UserError('User with the same email already exists!');
    }
};

const validateSignUp = async signUpPayload => {
    await emailUniquenessValidator(signUpPayload);
};

export const signIn = async (root, args, { auth }) => {
    const { email, password } = args;

    return new Promise((resolve, reject) => {
        db.User.find({
            where: {
                email
            }
        }).then(user => {
            if (!user) {
                reject(new UserError('Wrong email or password'));

                return;
            }

            db.User.validPassword(
                password,
                user.password,
                // eslint-disable-next-line no-shadow
                (error, user) => {
                    if (error) {
                        reject(new UserError(error));

                        return;
                    }

                    resolve(user);
                },
                user
            );

            auth.login(user);
        });
    });
};

export const signOut = async (root, args, { auth }) => {
    await auth.logout();

    return true;
};

export const signUp = async (root, args, { auth }) => {
    await validateSignUp(args);

    const { firstName, lastName, email, password } = args;

    const user = {
        firstName,
        lastName,
        email
    };

    try {
        await db.User.create({
            ...user,
            password
        });
    } catch (err) {
        throw new UserError(`Sign Up failed. ${err}`);
    }

    auth.login(user);

    return user;
};
