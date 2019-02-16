const resolvers = {
    Query: {
        record: (_, { id }, { cache }) => cache.data.data[`Record:${id}`]
    }
};

export default resolvers;
