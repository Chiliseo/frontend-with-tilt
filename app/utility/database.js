// Kari Barry - 1/11/2020
// Shorthander to return loaded Database object to functions that need it.
// Root of Database is company hash.
'use strict';

// DB Requires
var MongoClient = require('mongodb').MongoClient;
var dbUrl = `mongodb://tester:linker@${process.env.MONGO_DB_URI}:27017/`, auth = '?authMechanism=DEFAULT&authSource=admin';

module.exports = async function (companyId) {
    // Return an instance of the Database to manipulate directly within the method.
    return new Promise(function (resolve, reject) {
        MongoClient.connect(dbUrl + companyId + auth, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, dab) {
            if (err) reject(err);
            resolve(dab);
        });
    });
}