import db from '../../models/index';
import { withAuth } from '../utils';

export const userData = withAuth(async (root, args, context) => {
  const user = await db.User.find({
    where: {
      id: context.userId
    }
  });

  return user;
});
