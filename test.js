// const {body,check} = require('express-validator');
// const validator = require('validator');

// var x = process.stdin

// x.setEncoding('utf-8')

// x.on('data', (data) => {
//   let myRe = /ab+c/i;
//   console.log(myRe.test('cdbbdbsbz'))
//   // console.log(check(data).isString());
//   // console.log(validator.escape(data));

// });

// function main() {
//   var s = "Rafat Rashid Rahi";
//   var initials = arr.splice(0,2).map(name => name[0]).join('');

//   console.log(initials);
// }

function initials(s){
  return s.split(' ').splice(0,2).map(name => name[0]).join('');
}

function firstName(s){
  return s.split(' ')[0];
}

// main();
console.log(firstName("Rafat Rashid Rahi"));
