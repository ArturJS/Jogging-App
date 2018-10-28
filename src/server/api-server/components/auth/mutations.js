import { UserError } from 'graphql-errors';
import db from '../../models';

const waitForLogin = (req, user) =>
    new Promise((resolve, reject) => {
        req.login(user, {}, err => {
            if (err) {
                reject(new UserError(`Sign In failed. ${err}`));
            }

            return resolve(user);
        });
    });

const passwordValidator = async signUpPayload => {
    const { password, repeatPassword } = signUpPayload;

    if (password !== repeatPassword) {
        throw new UserError('Password and repeat password do not match!');
    }
};

const emailUniquenessValidator = async signUpPayload => {
    const { email } = signUpPayload;
    const userWithSameEmail = await db.User.find({ where: { email } });

    if (userWithSameEmail) {
        throw new UserError('User with the same email already exists!');
    }
};

const validateSignUp = async signUpPayload => {
    await passwordValidator(signUpPayload);
    await emailUniquenessValidator(signUpPayload);
};

export const signIn = async (root, args, { req }) => {
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

            req.login(user, {}, err => {
                if (err) {
                    reject(new UserError(`Sign In failed. ${err}`));
                }
            });
        });
    });
};

export const signOut = async (root, args, { req }) => {
    req.logOut();

    if (req.session) {
        req.session.destroy();
    }

    return true;
};

export const signUp = async (root, args, { req }) => {
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

    await waitForLogin(req, user);

    return user;
};
