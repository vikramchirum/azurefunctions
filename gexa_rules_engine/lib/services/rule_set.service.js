const db = require('../helpers/db.helper');
const rule_set_collection = db.get('Rule_Collections');

getById = async function (id) {
    try {
        let result = await rule_set_collection.findOne({_id: id});
        return result;
    }
    catch (err) {
        return err;
    }
};

module.exports = { getById : getById };