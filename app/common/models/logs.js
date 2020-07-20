// Kari Barry - December 18th 2019
// Logging method remotes, used only to help service agents retrieve log activity over REST
/*
    LOG LOGIC IS DEFINED IN /utility/loggingCore.js THIS IS FOR REMOTE LOGIC ONLY
*/
'use strict';
var dbUrl = `mongodb://tester:linker@${process.env.MONGO_DB_URI}:27017/links?authMechanism=DEFAULT&authSource=admin`;
var userCompany = require('../../utility/userLookup');
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

var queries = [
    "Company_to_InfusionSoft",
    "Contact_to_InfusionSoft",
    "Opportunity_to_InfusionSoft",
    "Company_to_ConnectWise",
    "Contact_to_ConnectWise",
    "Opportunity_to_ConnectWise",
    "Company_to_DattoAutotask",
    "Contact_to_DattoAutotask",
    "Opportunity_to_DattoAutotask"
], events = ["Create", "Update"];

module.exports = function (Logs) {
    // No create remotes exposed

    Logs.beforeRemote('find', async function (context) {
        return new Promise(async function (resolve, reject) {
            if (context.req.accessToken != null) {
                // 1) If input is by a customer within that company, locate that customer's companyId
                userCompany(context).then(company => {
                    context.args.filter = { "where": { "companyId": company.companyId } };
                    resolve();
                }).catch(() => {
                    // ADMIN USER
                    // resolve all records as per the normal API Specification.
                    resolve();
                });
            }
            else {
                var error = new Error("You need to be logged in to get the Logs.");
                error.statusCode = 400;
                reject(error);
            }
        });
    });

    Logs.statistics = async function (context) {
        return new Promise(async function (resolve, reject) {
            if (context.req.accessToken != null) {
                // 1) If input is by a customer within that company, locate that customer's companyId
                userCompany(context).then(company => {
                    resolve(getStatistics(company.companyId));
                }).catch(() => {
                    // ADMIN USER
                    // resolve all records as per the normal API Specification.
                    resolve(getStatistics());
                });
            }
            else {
                var error = new Error("You need to be logged in to get statistics.");
                error.statusCode = 400;
                reject(error);
            }
        });
    }

    Logs.summary = async function (context) {
        return new Promise(async function (resolve, reject) {
            if (context.req.accessToken != null) {
                // 1) If input is by a customer within that company, locate that customer's companyId
                userCompany(context).then(company => {
                    resolve(getSummary(company.companyId));
                }).catch(() => {
                    // ADMIN USER
                    // resolve all records as per the normal API Specification.
                    resolve(getSummary());
                });
            }
            else {
                var error = new Error("You need to be logged in to get a sync summary.");
                error.statusCode = 400;
                reject(error);
            }
        });
    }

    Logs.remoteMethod(
        'statistics', {
        accepts: {
            arg: 'context', type: 'object',
            'http': {
                source: 'context'
            }
        },
        description: 'Use logs to return numeric statistics about all synchronization activity.',
        returns: {
            root: true,
            type: 'object'
        },
        http: {
            path: '/statistics',
            verb: 'get'
        }
    }
    );

    Logs.remoteMethod(
        'summary', {
        accepts: {
            arg: 'context', type: 'object',
            'http': {
                source: 'context'
            }
        },
        description: 'Return a full summary report with detailed information on every sync performed.',
        returns: {
            root: true,
            type: 'object'
        },
        http: {
            path: '/summary',
            verb: 'get'
        }
    }
    );

};

function getStatistics(companyId) {
    return logDb(false, companyId).then(final => {
        // Remove products with no statistics
        final = final.filter(f => { return f[Object.keys(f)[0]].reduce(function (a, c) { return c.count + a; }, 0) != 0; });
        // Flatten the array to a single object
        final = Object.assign({}, ...final);
        let createdTotal = Object.values(final).reduce(function (accumulator, thisQuery) { return accumulator + thisQuery.reduce(function (sum, thisEvent) { if (thisEvent.event == "Create") return thisEvent.count + sum; else return sum; }, 0); }, 0);
        let updatedTotal = Object.values(final).reduce(function (accumulator, thisQuery) { return accumulator + thisQuery.reduce(function (sum, thisEvent) { if (thisEvent.event == "Update") return thisEvent.count + sum; else return sum; }, 0); }, 0);
        let grandTotal = createdTotal + updatedTotal;
        // Change the format to be that requested by frontend team
        // COMBAK: this is kinda dumb.
        return {
            totals: {
                created: createdTotal,
                updated: updatedTotal,
                total: grandTotal
            },
            events: [
                {
                    name: 'Companies Created',
                    countPSA: _.get(final, "Company_to_ConnectWise[0].count", 0) + _.get(final, "Company_to_DattoAutotask[0].count", 0),
                    countCRM: _.get(final, "Company_to_InfusionSoft[0].count", 0),
                    event: 'Created'
                },
                {
                    name: 'Companies Updated',
                    countPSA: _.get(final, "Company_to_ConnectWise[1].count", 0) + _.get(final, "Company_to_DattoAutotask[1].count", 0),
                    countCRM: _.get(final, "Company_to_InfusionSoft[1].count", 0),
                    event: 'Updated'
                },
                {
                    name: 'Contacts Created',
                    countPSA: _.get(final, "Contact_to_ConnectWise[0].count", 0) + _.get(final, "Contact_to_DattoAutotask[0].count", 0),
                    countCRM: _.get(final, "Contact_to_InfusionSoft[0].count", 0),
                    event: 'Created'
                },
                {
                    name: 'Contacts Updated',
                    countPSA: _.get(final, "Contact_to_ConnectWise[1].count", 0) + _.get(final, "Contact_to_DattoAutotask[1].count", 0),
                    countCRM: _.get(final, "Contact_to_InfusionSoft[1].count", 0),
                    event: 'Updated'
                },
                {
                    name: 'Opportunities Created',
                    countPSA: _.get(final, "Opportunity_to_ConnectWise[0].count", 0) + _.get(final, "Opportunity_to_DattoAutotask[0].count", 0),
                    countCRM: _.get(final, "Opportunity_to_InfusionSoft[0].count", 0),
                    event: 'Created'
                },
                {
                    name: 'Opportunities Updated',
                    countPSA: _.get(final, "Opportunity_to_ConnectWise[1].count", 0) + _.get(final, "Opportunity_to_DattoAutotask[1].count", 0),
                    countCRM: _.get(final, "Opportunity_to_InfusionSoft[1].count", 0),
                    event: 'Updated'
                },
            ]
        }
    });
}

function getSummary(companyId) {
    return logDb(true, companyId).then(final => {
        // Remove products with no statistics
        final = final.filter(f => { return f[Object.keys(f)[0]].reduce(function (a, c) { return c.records.length + a; }, 0) != 0; });
        // Flatten the array to a single object
        final = Object.assign({}, ...final);
        // Remove redundant log information
        for (const key in final) {
            final[key] = final[key].map(entry => {
                return {
                    event: entry.event,
                    records: entry.records.map(record => {
                        let encoded = {
                            Date: record.Date,
                            Name: record.Content.name
                        }
                        if (record.Content.link) encoded.Link = record.Content.link;
                        return encoded;
                    })
                }
            });
        }
        return final;
    });
}

// fullRecord : Boolean, companyId : string
function logDb(fullRecordFlag, companyId) {
    return new Promise(async function (close) {
        MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
            var totals = queries.map(query => {
                return new Promise(async function (resolve) {
                    var operations = events.map(event => {
                        return new Promise(async function (res, rej) {
                            var search = {
                                Outcome: true,
                                Source: query,
                                'Content.event': event
                            }
                            if (companyId) search.companyId = companyId;

                            if (fullRecordFlag) {
                                client.db().collection(`logs`).find(search).toArray(function (err, records) {
                                    if (err) rej(err);
                                    res({
                                        event: event,
                                        records: records
                                    });
                                });
                            }
                            else {
                                client.db().collection(`logs`).find(search).count(function (err, count) {
                                    if (err) rej(err);
                                    res({
                                        event: event,
                                        count: count
                                    });
                                });
                            }
                        });
                    });
                    Promise.all(operations).then((actions) => {
                        resolve({
                            [query]: actions
                        });
                    });
                });
            });
            Promise.all(totals).then((result) => { client.close(); close(result) });
        });
    });
}
