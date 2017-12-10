export const authSchemas = {
  signUpSchema: {
    properties: {
      firstName: {
        type: 'string',
        minLength: 1,
        maxLength: 254
      },
      lastName: {
        type: 'string',
        minLength: 1,
        maxLength: 254
      },
      email: {
        type: 'string',
        minLength: 5,
        maxLength: 254
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 254
      },
      repeatPassword: {
        type: 'string',
        maxLength: 254
      }
    },
    required: [
      'firstName',
      'lastName',
      'email',
      'password',
      'repeatPassword'
    ]
  }
};
