const rules_service = require('./services/rule_set.service');

module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.method.toUpperCase() === 'POST') {
        await post(context, req);
    } else if (req.method.toUpperCase() === 'GET') {
        if (req.query.id) {
            await get_by_id(context, req);
        } else {
           await get(context, req);
        }
    } else if (req.method.toUpperCase() === 'PUT') {
        await put(context, req);
    } else if (req.method.toUpperCase() === 'PATCH') {
        await patch(context, req);
    } else if (req.method.toUpperCase() === 'DELETE') {
        await delete_rule_set(context, req);
    }
};

async function post(context, req) {
    try {
        if (req.body) {
            let rule_set = req.body;
            let result = await rules_service.insert(rule_set, 'agent');
            context.res = {
                body: result
            };
        } else {
            context.res = {
                status: 400,
                body: 'bad request'
            };
        }
    }
    catch (err) {
        context.res = {
            status: 500,
            body: { Message: err.message || err }
        };
    }
}

async function get_by_id(context, req) {
    try {
        let result = await rules_service.getById(req.query.id);
        if (result) {
            context.res = {
                body: result
            };
        }
        else {
            context.res = {
                status: 404,
                body: { Message: 'Not Found' }
            };
        }
    }
    catch (err) {
        context.res = {
            status: 500,
            body: { Message: err.message || err }
        };
    }
}

async function patch(context, req) {
    try {
        let rule_set = req.body;
        let result = await rules_service.update(req.query.id, rule_set, 'agent');
        context.res = {
            body: result
        };
    }
    catch (err) {
        context.res = {
            status: 500,
            body: { Message: err.message || err }
        };
    }
}

async function get(context, req) {
    try {

        if (req.query.Type) {
            req.query.Type = {
                $regex: req.query.Type,
                $options: 'i'
            };
        }

        let results = await rules_service.search(req.query);
        if (results && results.length) {
            context.res = {
                body: results
            };
        }
        else {
            context.res = {
                status: 404,
                body: { Message: 'Not Found' }
            };
        }
    }
    catch (err) {
        context.res = {
            status: 500,
            body: { Message: err.message || err }
        };
    }
}

async function delete_rule_set(context, req) {
    try {
        let result = await rules_service.delete(req.query.id);
        if (result) {
            context.res = {
                body: results
            };
        }
        else {
            context.res = {
                status: 404,
                body: { Message: 'Not Found' }
            };
        }
    }
    catch (err) {
        context.res = {
            status: 500,
            body: { Message: err.message || err }
        };
    }
}