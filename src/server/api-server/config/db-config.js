module.exports = {
  development: {
    connectionString: 'postgres://postgres:root@127.0.0.1:5432/jogging-app'
  },
  production: {
    connectionString: process.env.DATABASE_URL
  }
};