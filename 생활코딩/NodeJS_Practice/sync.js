let fs = require('fs');

console.log('A');
let result = fs.readFileSync('./sample.txt','utf8');
console.log(result);
console.log('C');

console.log('******************');

console.log('A');
result = fs.readFile('./sample.txt','utf8',(err,result) => {
    console.log(result);
});
console.log(result);
console.log('C');
