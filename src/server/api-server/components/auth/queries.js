import db from '../../models/index';
import { isAuthenticatedResolver } from '../acl';

export const userData = isAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const user = await db.User.find({
      where: {
        id: context.userId
      }
    });

    return user;
  }
);
