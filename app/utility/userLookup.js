// Kari Barry - 12/23/2019
// Retrieve contextual information about the user making a request and return their parent company.
let app = require('../server/server');
var get = require('lodash/get');

// get customer's company or return company
module.exports = async function (context) {
    return new Promise(function (resolve, reject) {
        if (context.req.accessToken.principalType == "company") {
            resolve({
                companyId: context.req.accessToken.userId,
                principal: "company"
            });
        }
        if (context.req.accessToken.principalType == "employee") {
            app.models.employee.findOne({ where: { _id: context.req.accessToken.userId } }, async function (err, employee) {
                resolve({
                    companyId: employee.companyId,
                    principal: "employee",
                    admin: employee.admin
                });
            });
        }
        else if (context.req.accessToken.principalType == "appAdmin") {
            // Engage catch block for admin users as they do not have a particular relationship with any one record.
            var error = new Error("Admins cannot own individual company records.");
            error.statusCode = 400;
            reject(error);
        }
    });
}