const jre = require('json-rules-engine');
let rules_helper = {};

rules_helper.evaluate = async function (rules, facts, first_result_only) {
    return new Promise(async function (resolve, reject) {
        try {
            if (rules) {
                let engine = new jre.Engine(rules);
                try {
                    engine
                        .on('success', function (event, almanac, ruleResult) {
                            if (first_result_only) {
                                engine.stop();
                                resolve(event);
                            }
                        })
                        .on('failure', function (event, almanac, ruleResult) {

                        });

                    engine
                        .run(facts)
                        .then(function (events) {
                            if (!first_result_only) {
                                resolve(events);
                            }
                            else if (events.length === 0) {
                                reject('No matching rule');
                            }
                        }, function (err) {
                            reject(err);
                        });
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject('Invalid Type');
            }
        }
        catch(err){
            reject(err);
        }
    });
};

module.exports = rules_helper;