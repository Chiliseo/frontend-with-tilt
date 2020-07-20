// Kari Barry, January 25th 2020
// Track transactions between products and intra-product to prevent circular conditions.

'use strict';

var Redis = require('ioredis');

// Keep track of intra-sync actions here.
var redis = new Redis({
    host: 'rd',
    password: null,
    port: 6379,
    database: 0,
});

module.exports = function (ledger) {
    this.client = ledger;

    /* INTRA-operations */
    // The ledger client is instantiated to be the ID of the connection Object
    // Specifies a queue with a set number of requests to block for traffic.

    this.set_intra = function (id) {
        redis.incr(`${this.client}_${id}`);
        redis.expire(`${this.client}_${id}`, 60);
    };

    this.get_intra = function (id) {
        var client = this.client;
        return new Promise(async function (resolve, reject) {
            redis.get(`${client}_${id}`).then(function (value) {
                if (value != null) {
                    if (value > 0) {
                        redis.decr(`${client}_${id}`);
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            });
        });
    };

    /* Exterior Sync Tracking */

    this.pushId = function (platform, product, id) {
        var client = this.client;
        redis.sadd(`${platform}_${client}_${product}`, id).then(async function (result) {
            await new Promise(resolve => setTimeout(resolve, 60000));
            redis.srem(`${platform}_${client}_${product}`, id).then(function (rem) {
                if (rem == 1) {
                    //console.log(`${platform}_${client}_${product} : KEY ${id} EXPIRED`);
                }
                else {
                    //console.log(`ifs_${client.companyId}_contact : KEY ${id} WAS REMOVED PRIOR TO EXPIRATION`);
                }
            });
        });
    }

    this.pullId = function (platform, product, id) {
        var client = this.client;
        return new Promise(async function (resolve, reject) {
            redis.srem(`${platform}_${client}_${product}`, id).then(function (result) {
                if (result == 1) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }

    /* Database locking */

    this.pushQuery = function (product, query) {
        var client = this.client;
        redis.sadd(`${client}_${product}`, query).then(async function (result) {
            await new Promise(resolve => setTimeout(resolve, 40000));
            redis.srem(`${client}_${product}`, query).then(function (rem) {
                if (rem == 1) {
                    //Unblocking query ${query};
                }
                else {

                }
            });
        });
    }

    this.checkQuery = function (product, query) {
        var client = this.client;
        return new Promise(async function (resolve, reject) {
            redis.sismember(`${client}_${product}`, query).then(function (result) {
                if (result == 1) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }

    this.pullQuery = function (product, query) {
        var client = this.client;
        return new Promise(async function (resolve, reject) {
            redis.srem(`${client}_${product}`, query).then(function (result) {
                if (result == 1) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }

    /* Record Creation locking */

    this.pushCreate = function (product, query) {
        var client = this.client;
        redis.sadd(`${client}_${product}`, query).then(async function (result) {
            await new Promise(resolve => setTimeout(resolve, 500000));
            redis.srem(`${client}_${product}`, query).then(function (rem) {
                if (rem == 1) {

                }
                else {

                }
            });
        });
    }

    this.checkCreate = function (product, query) {
        var client = this.client;
        return new Promise(async function (resolve, reject) {
            redis.sismember(`${client}_${product}`, query).then(function (result) {
                if (result == 1) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }

};
