const db = require('./lib/helpers/db.helper');
const auth_helper = require('./lib/helpers/auth.helper');
const service_request_partials = db.get('Service_Request_Partials');

module.exports = async function (context, req) {
    
    context.log('JavaScript HTTP trigger function processed a request in test.');
    
    if(req.method.toUpperCase() === 'POST' && req.body && Object.keys(req.body).length > 1) {

       let user = await validate_token(context, req);
       if(user)
       {
          let partial = req.body;
          partial.Date_Created = new Date();
          partial.Date_Last_Modified = new Date();
          
          let result = await service_request_partials.insert(req.body);
          context.res = {
                  // status: 200, /* Defaults to 200 */
                  body : {   Is_Success: true }
          };
       } else {
        context.res = {
            status: 401,
            body: { Message : "Invalid jwt" }
        };
       }
    } else {
          context.res = {
            status: 400,
            body: { Message : "Please pass a partial service request with at least a few fields." }
        };
    }

    context.res.headers = {
        'Content-Type': 'application/json'
    };

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