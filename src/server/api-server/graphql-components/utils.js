export const withAuth = (resolver) => async(root, args, context, ...restArgs) => {
  if (!context.userId) {
    return;
  }

  return await resolver(root, args, context, ...restArgs);
};
