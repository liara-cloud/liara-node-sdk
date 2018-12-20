'use strict';

require('util.promisify/shim')();

const Storage = require('./lib/storage');

const Liara = {
	Storage,
};

module.exports = Liara;
