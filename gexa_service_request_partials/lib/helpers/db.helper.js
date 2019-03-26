const monk = require('monk');
let db;

if (process.env.MONGO_AUTH_SOURCE) {
    db = monk(process.env.MONGO_CONN_STRING, {authSource: process.env.MONGO_AUTH_SOURCE});
}
else {
    db = monk(process.env.MONGO_CONN_STRING);
}

db.then(function () {
      
    })
    .catch(function (err) {
      
    });

module.exports = db;
