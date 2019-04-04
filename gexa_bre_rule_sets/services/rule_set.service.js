const service_helper = require('../../Shared/lib/helpers/service.helper');
const db = require('../../Shared/lib/helpers/db.helper');
const rule_set_collection = db.get('Rule_Collections');

let rule_set_service = service_helper.generate_crud_functions(rule_set_collection);

module.exports = rule_set_service;