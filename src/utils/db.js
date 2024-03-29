import knexObj from 'knex';

const knex = knexObj({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ads'
  },
  pool: { min: 0, max: 7 }
});

export default knex;