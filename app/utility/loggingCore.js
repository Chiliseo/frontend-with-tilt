'use strict';
// Kari Barry - December 18th 2019
// Discrete Log Writer to modularize writing errors and other events to the LogDB
let app = require('../server/server');

// logError(string: companyId, string: message, object: error)
// Constructs and returns a human legible HTTP Error (400)
// Logs all details to the log database
async function logError(companyId, message, err) {
    let e = new Error();
    let frame = e.stack.split('\n')[2];
    let arr = frame.split(' ');
    // position within the stack varies slightly
    if (typeof arr[6] != 'undefined') {
        let where = arr[6].split(/[:()]/);
        var fileName = where[1];
    }
    else if (typeof arr[5] != 'undefined') {
        let where = arr[5].split(/[:()]/);
        var fileName = where[0];
    }

    // remove potentially undefined error elements to prevent crashes
    Object.keys(err).forEach(key => err[key] === undefined ? delete err[key] : '');

    var entry = {
        'Date': Date.now(),
        'Source': fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length),
        'Outcome': false,
        'Error': err,
        'Message': message,
        'companyId': companyId
    };
    app.models.logs.create(entry, function (err2, end) { });
    var error = new Error(message);
    error.statusCode = 400;
    return error;
}

async function logStatus(companyId, method, content) {

    app.models.logs.create({
        'Date': Date.now(),
        'Source': method,
        'Outcome': true,
        'Content': content,
        'companyId': companyId
    }, function (err, log) { });

}

async function openSync(companyId, method, name) {
    return new Promise(async function (resolve, reject) {
        app.models.logs.create({
            'Date': Date.now(),
            'Source': method,
            'Outcome': false,
            'Content': {
                name: name,
                message: "Sync started processing but has not finished."
            },
            'companyId': companyId
        }, function (err, log) {
            if (err) console.log(err);
            resolve(log.id);
        });
    });
}

async function resolveSync(id, content) {

    app.models.logs.updateAll({ id: id },
        {
            'Outcome': true,
            'Content': content
        },
        function (err, instance) {

        });

}

async function rejectSync(id, message, err) {

    app.models.logs.updateAll({ id: id },
        {
            'Outcome': false,
            'Error': err,
            'Message': message
        },
        function (err, instance) {

        });

}

async function removeSync(id) {
    app.models.logs.destroyAll({ id: id }, function (err, deleted) { });
}

async function removeFailed(companyId, name) {
    app.models.logs.destroyAll({ 'Content.name': name, Outcome: false, companyId: companyId }, function (err, deleted) { });
}

module.exports = {
    error: logError,
    status: logStatus,
    open: openSync,
    pass: resolveSync,
    fail: rejectSync,
    clear: removeSync,
    clearAll: removeFailed
};
