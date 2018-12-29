import authBLL from './auth.bll';

export const signIn = async (root, args, { auth }) => {
    const { email, password } = args;
    const user = await authBLL.getUser({ email, password });

    auth.login(user);

    return user;
};

export const signOut = async (root, args, { auth }) => {
    await auth.logout();

    return true;
};

export const signUp = async (root, args, { auth }) => {
    const { firstName, lastName, email, password } = args;
    const user = await authBLL.createUser({
        firstName,
        lastName,
        email,
        password
    });

    auth.login(user);

    return user;
};
