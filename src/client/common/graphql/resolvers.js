const resolvers = {
  Query: {
    record: (_, { id }, { cache }) => {
      return cache.data.data[`Record:${id}`];
    }
  }
};

export default resolvers;
