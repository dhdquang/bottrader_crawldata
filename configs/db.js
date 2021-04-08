module.exports = {
  // mongodb
  database_test: 'mongodb://localhost/db_test',
  database: process.env.DB_CONNECTION_STRING,
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};
