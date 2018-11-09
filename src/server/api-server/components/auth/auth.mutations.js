import { createError } from 'apollo-errors';
import db from '../../models';

const ErrorUserAlreadyExists = createError('ErrorUserAlreadyExists', {
    message: 'User with the same email already exists!'
});
const ErrorWrongCredentials = createError('ErrorWrongCredentials', {
    message: 'Wrong email or password'
});

const emailUniquenessValidator = async signUpPayload => {
    const { email } = signUpPayload;
    const userWithSameEmail = await db.User.find({ where: { email } });

    if (userWithSameEmail) {
        throw new ErrorUserAlreadyExists();
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
                reject(new ErrorWrongCredentials());

                return;
            }

            db.User.validPassword(
                password,
                user.password,
                // eslint-disable-next-line no-shadow
                (error, user) => {
                    if (error) {
                        reject(new ErrorWrongCredentials());

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

    await db.User.create({
        ...user,
        password
    });

    auth.login(user);

    return user;
};
