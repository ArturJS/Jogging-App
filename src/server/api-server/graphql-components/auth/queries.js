import { UserType } from './schema';
import db from '../../models/index';
import { withAuth } from '../utils';

export const getUserData = {
  type: UserType,
  description: 'Get user data',
  resolve: withAuth(async (root, args, context) => {
    const user = await db.User.find({
      where: {
        id: context.userId
      }
    });

    return user;
  })
};
