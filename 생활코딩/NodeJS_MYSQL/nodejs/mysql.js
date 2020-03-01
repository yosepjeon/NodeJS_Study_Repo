let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'enekelx1',
    password: 'enekeldytpq1Q@',
    database: 'yosep-practice'
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