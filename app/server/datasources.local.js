module.exports = {
    db: {
        host: process.env.MONGO_DB_URI,
        port: 27017,
        url: '',
        database: 'links',
        password: 'linker',
        name: 'db',
        user: 'tester',
        authSource: 'admin',
        connector: 'mongodb',
    }
};
