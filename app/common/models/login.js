// Kari Barry - November 24th 2019
// Universal Login Method, Log in any user regardless of which category their account belongs to.
// Ideally extensible to support Passport.JS longin systems.

'use strict';
let app = require('../../server/server');
var userCompany = require('../../utility/userLookup');

module.exports = function (Login) {
    Login.remoteMethod(
        'logIn', {
        accepts: [
            { arg: 'credentials', type: 'object', required: true, http: { source: 'body' } },
            {
                arg: 'include', type: ['string'], http: { source: 'query' },
                description: 'Related objects to include in the response. ' +
                    'See the description of return value for more details.'
            }
        ],
        description: 'Queries all User Models and attempts login, returning the a token.',
        returns: {
            arg: 'accessToken', type: 'object', root: true
        },
        http: {
            path: '/',
            verb: 'post',
        },
    }
    );

    Login.remoteMethod(
        'reset', {
        accepts: [
            { arg: 'info', type: 'object', required: true, http: { source: 'body' } },
            {
                arg: 'include', type: ['string'], http: { source: 'query' },
                description: 'Related objects to include in the response. ' +
                    'See the description of return value for more details.'
            }
        ],
        description: 'Queries all User Models and attempts to send password reset email.',
        returns: {
            arg: 'accessToken', type: 'object', root: true
        },
        http: {
            path: '/reset',
            verb: 'post',
        },
    }
    );

    Login.logIn = async function (credentials) {
        // Wrap with promise to await all query responses
        return new Promise(async function (resolve, reject) {

            // Start with the model intended to handle most base users and then reduce to fewer-user models with enhanced permissions.
            return app.models.company.login(credentials, function (err, token) {
                if (err) {
                    return app.models.employee.login(credentials, function (err, token) {
                        if (err) {
                            return app.models.appAdmin.login(credentials, function (err, token) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(token);
                                }
                            });
                        }
                        else {
                            getCompany(token).then(company => {
                                token.company = company;
                                resolve(token);
                            });
                        }
                    });
                }
                else {
                    getCompany(token).then(company => {
                        token.company = company;
                        resolve(token);
                    });
                }
            });
        });
    }

    Login.reset = async function (info) {
        info.email = info.email.toLowerCase();
        // Wrap with promise to await all query responses
        return new Promise(async function (resolve, reject) {
            // Start with the model intended to handle most base users and then reduce to fewer-user models with enhanced permissions.
            return app.models.company.resetPassword(info, function (err, done) {
                if (err) {
                    return app.models.employee.resetPassword(info, function (err, done) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            // SENDING PASSWORD RESET TO CUSTOMER
                            resolve();
                        }
                    });
                }
                else {
                    // SENDING PASSWORD RESET TO COMPANY
                    resolve();
                }
            });
        });
    }

};

async function getCompany(token) {
    return new Promise(async function (resolve, reject) {
        userCompany({
            "req": {
                "accessToken": {
                    "principalType": token.principalType,
                    "userId": token.userId
                }
            }
        }).then(context => {
            app.models.company.findOne({ where: { _id: context.companyId } }, async function (err, company) {
                if (company) {
                    let options = { ...company.__data };
                    options.admin = (context.admin || context.principal == "company") ? true : false;
                    delete options.password;
                    delete options.email;
                    options.companyId = options.id;
                    delete options.id;
                    resolve(options);
                }
                else {
                    reject("Viewer Account does not have matching company.")
                }
            });
        }).catch(() => {
            //Admin token
        });
    });
}
