import { baseDIContainer } from '../../di';

const authService = baseDIContainer.getAuthService();

export const signIn = async (root, args, { auth }) => {
    const { email, password } = args;
    const user = await authService.getUser({ email, password });

    auth.login(user);

    return user;
};

export const signOut = async (root, args, { auth }) => {
    await auth.logout();

    return true;
};

export const signUp = async (root, args, { auth }) => {
    const { firstName, lastName, email, password } = args;
    const user = await authService.createUser({
        firstName,
        lastName,
        email,
        password
    });

    auth.login(user);

    return user;
};
