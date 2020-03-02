let mysql = require('mysql');

let db = mysql.createConnection({
    host: '',
    user: '',
    password: '@',
    database: '-practice'
});
db.connect();
module.exports = db;