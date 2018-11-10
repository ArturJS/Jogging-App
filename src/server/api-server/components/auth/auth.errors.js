import { createError } from 'apollo-errors';

export const ErrorUserAlreadyExists = createError('ErrorUserAlreadyExists', {
    message: 'User with the same email already exists!'
});

export const ErrorWrongCredentials = createError('ErrorWrongCredentials', {
    message: 'Wrong email or password'
});
