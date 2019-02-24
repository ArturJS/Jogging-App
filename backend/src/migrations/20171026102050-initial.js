module.exports = {
    async up(knex) {
        return knex.schema
            .createTable('user', t => {
                t.increments('id').primary();
                t.string('firstName', 127).notNullable();
                t.string('lastName', 127).notNullable();
                t.string('email', 127).notNullable();
                t.string('password', 127).notNullable();
            })
            .createTable('record', t => {
                t.increments('id').primary();
                t.bigInteger('date').notNullable();
                t.integer('distance').notNullable();
                t.integer('time').notNullable();
                t.float('averageSpeed').notNullable();
                t.integer('userId')
                    .notNullable()
                    .unsigned()
                    .references('id')
                    .inTable('user');
            });
    },

    down() {
        throw new Error('This is initial migration');
    }
};
