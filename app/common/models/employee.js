// Kari Barry - January 6th 2020
// Employee, a user owned by a company which can make many requests on that company's behalf.
'use strict';

var userCompany = require('../../utility/userLookup');
let app = require('../../server/server');
var moment = require('moment');

module.exports = function (Employee) {
    Employee.beforeRemote('create', async function (context) {
        await new Promise(function (resolve, reject) {
            var error = new Error("Only Main Company Accounts can create new Employee Accounts.");
            error.statusCode = 400;
            if (context.req.accessToken.principalType != "company") {
                reject(error);
            }
            else {
                context.args.data.companyId = context.req.accessToken.userId;
                context.args.data.created = moment().utc().format();
                resolve();
            }
        });
        return;
    });

    Employee.beforeRemote('find', async function (context) {
        return new Promise(async function (resolve, reject) {
            if (context.req.accessToken != null) {
                // 1) If input is by a employee within that company, locate that employee's companyId
                console.log(context);
                userCompany(context).then(company => {
                    context.args.filter = { "where": { "companyId": company.companyId } };
                    resolve();
                }).catch(() => {
                    // ADMIN USER
                    // Return all records as per the normal API Specification.
                    resolve();
                });
            }
            else {
                var error = new Error("You need to be logged in to get Viewers/Employees.");
                error.statusCode = 400;
                reject(error);
            }
        });
    });

    Employee.beforeRemote('count', async function (context) {
        return new Promise(async function (resolve, reject) {
            if (context.req.accessToken != null) {
                // 1) If input is by a employee within that company, locate that employee's companyId
                userCompany(context).then(company => {
                    context.args.filter = { "where": { "companyId": company.companyId } };
                    resolve();
                }).catch(() => {
                    // ADMIN USER
                    // Return all records as per the normal API Specification.
                    resolve();
                });
            }
            else {
                var error = new Error("You need to be logged in to count Viewers/Employees.");
                error.statusCode = 400;
                reject(error);
            }
        });
    });


    Employee.setRole = async function (id, admin, context) {
        return new Promise(async function (resolve, reject) {
            userCompany(context).then(ctx => {
                if (ctx.principal == "company") {
                    app.models.employee.findOne({ where: { _id: id } }, async function (err, employee) {
                        if (employee) {
                            employee.updateAttribute("admin", admin, function (err, result) {
                                resolve(result);
                            });
                        }
                        else {
                            var error = new Error("Employee not found.");
                            error.statusCode = 400;
                            reject(error);
                        }
                    });
                }
                else {
                    var error = new Error("Only the company account can promote/demote employees.");
                    error.statusCode = 400;
                    reject(error);
                }
            });
        });
    }

    Employee.remoteMethod("setRole", {
        accepts: [
            {
                arg: "id",
                type: "string",
                description: "Model id"
            },
            {
                arg: 'admin',
                type: 'boolean',
                http: { source: 'body' },
                description: 'flag distinguishing admin/viewer roles.'
            },
            {
                arg: "context",
                type: "object",
                http: { source: "context" }
            }
        ],
        description:
            "Give or revoke employee administrative priviliges.",
        http: {
            path: "/:id/admin",
            verb: "put"
        }
    });

};
