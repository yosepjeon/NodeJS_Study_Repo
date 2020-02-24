'use strict'

const arr = ['node.js','올인원'];

const newArr = arr.filter(key => key === 'node.js');
const mapArr = newArr.map(item => {
    title: item
});

console.log(mapArr);