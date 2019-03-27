
const auth_helper = require('./lib/helpers/auth.helper');
const rules_helper = require('./lib/rule.helper');
const rule_set_service = require('./lib/services/rule_set.service');

module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.method.toUpperCase() === 'POST' && req.body && req.body.fact && (req.body.rule_set_id || req.body.rules)) {

        let user = await validate_token(context, req);

        if (!user) {
            try {

                let rules;
                if (req.body.rules) {
                    rules = body.rules;
                } else {
                    let rule_set_id = req.body.rule_set_id;
                    let ruleset = await rule_set_service.getById(rule_set_id);
                    rules = ruleset.Rules;
                }

                let first_result_only = req.body.first_result_only;
                let fact = req.body.fact;

                if (rules) {
                    let result = await rules_helper.evaluate(rules, fact, first_result_only);
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        body: result
                    };
                } else {
                    context.res = {
                        status: 404,
                        body: { Message: "Rule Set Not Found." }
                    };
                }
            }
            catch (err) {
                context.log('Error is ' + err);
                context.res = {
                    status: 500,
                    body: { Message: "Error." }
                };
            }
        } else {
            context.res = {
                status: 401,
                body: { Message: "Invalid jwt" }
            };
        }
    } else {
        context.res = {
            status: 400,
            body: { Message: "Please pass a valid fact run request." }
        };
    }
};

async function validate_token(context, req) {
    if (req.headers && req.headers.authorization &&
        req.headers.authorization.split(' ')[0].toUpperCase() === 'BEARER') {
        let token = req.headers.authorization.split(' ')[1];
        try {
            let user = await auth_helper.verifyJWTToken(token);
            return user;
        } catch (err) {
            context.log(err);
            return null;
        }
    } else {
        context.log('empty token');
        return null;
    }
}