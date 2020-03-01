let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: '*',
<<<<<<< HEAD
    password: '*@',
    database: '*-*'
=======
    password: '*',
    database: '*'
>>>>>>> 861ea288151f41b42ccd9b0c1824f2fb2393193d
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
