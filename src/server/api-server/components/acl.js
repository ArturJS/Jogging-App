import { createError } from 'apollo-errors';
import baseResolver from './base-resolver';

const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You must be logged in to do this'
});

export const isAuthenticatedResolver = baseResolver.createResolver(
  // Extract the user from context (undefined if non-existent)
  (root, args, { userId }, info) => {
    if (!userId) {
      throw new AuthenticationRequiredError();
    }
  }
);
