// Kari Barry - November 24th 2019
// User Class definition for Companies, entities that own their sub-accounts, product connection objects, graphs and syncs.
'use strict';

var userCompany = require('../../utility/userLookup');
let app = require('../../server/server');
var moment = require('moment');
var _ = require('lodash');


module.exports = function (Company) {

    Company.beforeRemote('create', async function (context) {
        context.args.data.email = context.args.data.email.toLowerCase();
        context.args.data.created = moment().utc().format();
        return;
    });

    Company.beforeRemote('deleteById', async function (context) {
        await new Promise(async function (resolve, reject) {
            var error = new Error("Only Admins or Companys can delete Company Records.");
            error.statusCode = 400;
            if (_.get(context, "req.accessToken.principalType") == "appAdmin" || _.get(context, "req.accessToken.principalType") == "company") {
                app.models.company.findOne({ where: { _id: context.args.id } }, async function (err, company) {
                    /*
                    -------- Remove embedded products here before terminating the account ------------
                    This avoids issues related where hooks still actively send content for deleted user
                    */
                    resolve();
                });
            }
            else {
                reject(error);
            }
        });
    });

    Company.beforeRemote('find', async function (context) {
        return new Promise(async function (resolve, reject) {
            if (context.req.accessToken != null) {
                // 1) If input is by a Company within that company, locate that Company's companyId
                return userCompany(context).then(company => {
                    context.args.filter = { "where": { "_id": company.companyId } };
                    resolve();
                }).catch(() => {
                    // ADMIN USER
                    // Return all records as per the default API Specification.
                    resolve();
                });
            } else {
                var error = new Error("You need to be logged in to get companies.");
                error.statusCode = 400;
                reject(error);
            }
        });
    });

    // Administrators can update the embeded status object from here and override payment plans.
    Company.setStatus = async function (id, updates, context) {
        return new Promise(async function (resolve, reject) {
            userCompany(context).then(() => {
                var error = new Error("Only Administrators can update the status of a company.");
                error.statusCode = 400;
                reject(error);
            }).catch(() => {
                app.models.company.findOne({ where: { _id: id } }, async function (err, company) {
                    if (company) {
                        let update = {};
                        if (typeof updates.trial == "object") {
                            update.trial = updates.trial;
                        }
                        if (typeof updates.customer == "object") {
                            update.customer = updates.customer;
                        }
                        if (typeof updates.payment == "object") {
                            update.payment = updates.payment;
                        }
                        if (update != {}) {
                            company.updateAttribute("status", update, function (err, result) {
                                resolve(result);
                            });
                        }
                        else {
                            reject();
                        }
                    }
                    else {
                        var error = new Error("Company not found.");
                        error.statusCode = 400;
                        reject(error);
                    }
                });
            });
        });
    }

    Company.remoteMethod("setStatus", {
        accepts: [
            {
                arg: "id",
                type: "string",
                description: "Model id"
            },
            {
                arg: 'updates',
                type: 'object',
                http: { source: 'body' },
                description: 'Updates to apply to the status'
            },
            {
                arg: "context",
                type: "object",
                http: { source: "context" }
            }
        ],
        description:
            "Allow admins to update the payment status of an account manually.",
        http: {
            path: "/:id/status",
            verb: "put"
        }
    });

};
