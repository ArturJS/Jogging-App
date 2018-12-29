import { createError } from 'apollo-errors';

export const ErrorRecordAlreadyExists = createError(
    'ErrorRecordAlreadyExists',
    {
        message: 'Record with the same date already exists!'
    }
);

export const ErrorRecordNotFound = createError('ErrorRecordNotFound', {
    message: 'Record not found!'
});
