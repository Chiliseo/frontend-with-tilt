// Instance Directory - Keep track of other instances and hardcoded temporary instances
// Allow DataLink instances to become federated, have a shortlist of other servers to ping.
// Kari Barry - 06/26/2020
'use strict';
let app = require('../../server/server');
var MongoClient = require('mongodb').MongoClient;

// hardcode legacy instances that require redirection
var hardcoded = [];

var databases = [{
    "instance": app.url,
    "connection": process.env.MONGO_DB_URI
}];

module.exports = function (Directory) {

    Directory.lookup = async function (email) {
        return new Promise(async function (found, lost) {
            var directory = databases.map(async function (DbUrl) {
                var emails = [];
                return new Promise(async function (resolve, reject) {
                    MongoClient.connect(`mongodb://tester:linker@${DbUrl.connection}:27017/links?authMechanism=DEFAULT&authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
                        if (err) reject(err);
                        client.db().collection(`company`).find({}, { "email": 1, '_id': 0 }).toArray(function (err, companies) {
                            let accounts = companies.map(company => { return company.email });
                            emails.push(...accounts);
                            client.db().collection(`employee`).find({}, { "email": 1, '_id': 0 }).toArray(function (err, employees) {
                                client.close();
                                let accounts = employees.map(employee => { return employee.email });
                                emails.push(...accounts);
                                resolve({
                                    "instance": DbUrl.instance,
                                    "emails": emails
                                });
                            });
                        });
                    });
                });
            });

            Promise.all(directory).then((values) => {
                var discovery = [...hardcoded, ...values].find(value =>
                    value.emails.some(mail => email.toLowerCase() == mail)
                );
                if (discovery) found(discovery.instance);
                else {
                    var error = new Error("Email not found on any DataLink instances");
                    error.statusCode = 404;
                    lost(error);
                }
            });
        });
    }

    Directory.remoteMethod("lookup", {
        accepts: [
            {
                arg: "email",
                type: "string"
            }
        ],
        returns: {
            type: "string",
            root: true
        },
        description:
            "Find where a user's account is hosted based on their Email.",
        http: {
            path: "/:email",
            verb: "post"
        }
    });

};
