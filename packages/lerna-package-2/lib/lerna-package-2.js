'use strict';

const lernaPackage1 = require('@mjz-test/lerna-package-1');

module.exports = lernaPackage2;

function lernaPackage2() {
    console.log(lernaPackage1('this is str'));
}

console.log('this is running in package 2');