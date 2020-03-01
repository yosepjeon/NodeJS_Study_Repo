let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: '*',
    password: '*',
    database: '*'
});

connection.connect();

connection.query('SELECT * FROM topic',(error,result) => {
    if(error) {
        console.log(error);
    }else {
        console.log(result);
    }
});

connection.end();
