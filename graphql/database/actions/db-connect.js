const knex = require('../mysql')

// use raw SQl instead of ORM for future migration of backend
// test if connect to local sql
knex.raw('show schemas')
    .then(res => console.log(res))