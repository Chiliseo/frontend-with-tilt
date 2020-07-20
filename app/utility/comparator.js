// Kari Barry - January 22nd 2020
// Make an external function that can handle all the object assignments needed to form API requests.
'use strict';

var _ = require('lodash');
const phone = require('phone');

var rfc6902 = require('rfc6902');

// Constructor comparitors : reference two objects to figure out if the first should be pushed onto a newly constructed object.
// Return mutated object.
function stringCompare(a, b, object, key) {
    if (typeof a != 'undefined' && a != '' && a != null) {
        if (typeof b != 'undefined' && b != '' && b != null) {
            if (a == b) {
                // Do Nothing
            } else {
                _.set(object, key, a);
            }
        } else {
            _.set(object, key, a);
        }
    }
};

module.exports = {
    string: stringCompare,
    phone: phoneCompare,
    connectWise: cwCompare,
    infusionSoft: {
        company: ifsCompany,
        contact: ifsContact,
    },
};

function phoneCompare(a, b, object, key) {
    // With four arguments, method mutates the given object
    if (typeof object == 'object' && key) {
        if (typeof a != 'undefined' && a != '' && a != null) {
            if (typeof b != 'undefined' && b != '' && b != null) {
                if ((phone(a)[0] != phone(b)[0])) {
                    _.set(object, key, a);
                }
                // Do not validate phone number.
                else if (!(phone(a).length)) {
                    _.set(object, key, a);
                }
            } else {
                _.set(object, key, a);
            }
        }
    }
    // With two arguments, just validate and compare the phones
    if (typeof a != 'undefined' && a != '' && a != null) {
        if (typeof b != 'undefined' && b != '' && b != null) {
            return (phone(a)[0] == phone(b)[0]);
        }
    } else {
        return false;
    }
};

// Binary comparitors : use a template to figure out if specific objects are equal to eachother.
// Return Boolean.

function cwCompare(next, previous) {
    if (previous) {
        delete previous._id;
        var trueNext = _.cloneDeep(next);
        delete previous._info.lastUpdated;
        delete previous._info.updatedBy;
        delete previous._info.image_href;
        delete trueNext._info.lastUpdated;
        delete trueNext._info.updatedBy;
        delete trueNext._info.image_href;

        // let patch = rfc6902.createPatch(previous, trueNext);

        return (_.isEqual(trueNext, previous));
    } else {
        return false;
    }
};

function ifsCompany(next, previous) {
    if (previous) {
        delete previous._id;
        delete previous.email_opted_in;
        delete previous.email_status;

        var trueNext = _.cloneDeep(next);
        if (!trueNext.email_address) {
            delete previous.email_address;
        }
        if (!trueNext.custom_fields) {
            delete previous.custom_fields;
        }
        if (!(_.get(trueNext, 'address.zip_four'))) {
            delete previous.address.zip_four;
        }
        if (!(_.get(trueNext, 'phone_number.extension'))) {
            delete previous.phone_number.extension;
        }
        if (!(_.get(trueNext, 'fax_number.number'))) {
            if (!(_.get(previous, 'fax_number.number'))) {
                delete previous.fax_number.number;
            }
        }

        let patch = rfc6902.createPatch(previous, trueNext);

        return (_.isEqual(trueNext, previous));
    } else {
        return false;
    }
}

function ifsContact(next, previous) {
    if (previous) {
        delete previous._id;
        delete previous.last_updated;
        var trueNext = _.cloneDeep(next);
        delete trueNext.last_updated;
        return (_.isEqual(trueNext, previous));
    } else {
        return false;
    }
}
