'use strict'

const arr = ['node.js', '올인원'];

const ret = arr.find(key => key === '올인원');
const res = arr.includes('node.js');

console.log(ret);
console.log(res);

arr.forEach(element => {
    console.log(element);
});
