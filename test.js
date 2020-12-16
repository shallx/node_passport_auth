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

function main() {
  try {
    throw { code: 900};
  } catch (error) {
    // console.error(error);
    console.log(error);
  }
}

main();
