let testFolder = '../../NodeJS_Project1/data'
let fs = require('fs');

fs.readdir(testFolder,(error,fileList) => {
    console.log(fileList);
});